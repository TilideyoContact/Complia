import { PrismaClient } from "@prisma/client";
import { leadCaptureSchema } from "../lib/validation";
import { sendConfirmation, sendRapport, scheduleNurturing } from "../lib/email";
import { getRecommendedOffer } from "../lib/recommendations";
import type { ApiResponse, LeadResponse, AnswerWithScore } from "../types";
import { calculatePreAuditScore, calculateDiagnosticScore } from "../lib/scoring";

const prisma = new PrismaClient();

// ─── POST /api/leads — Capture lead (email gate) ────────────────────────────

export async function POST_capture(
  request: Request
): Promise<Response> {
  try {
    const body = await request.json();
    const parsed = leadCaptureSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Donnees invalides",
            details: parsed.error.flatten().fieldErrors,
          },
        } satisfies ApiResponse<never>,
        { status: 400 }
      );
    }

    const { email, firstName, phone, company, sessionId, gdprConsent, marketingConsent } =
      parsed.data;

    // Verify session exists
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        answers: true,
        scores: { orderBy: { calculatedAt: "desc" }, take: 1 },
      },
    });

    if (!session) {
      return Response.json(
        {
          success: false,
          error: { code: "NOT_FOUND", message: "Session introuvable" },
        } satisfies ApiResponse<never>,
        { status: 404 }
      );
    }

    // Upsert user (same email = update)
    const user = await prisma.user.upsert({
      where: { email },
      create: {
        email,
        firstName,
        phone: phone || null,
        company: company || null,
        sector: session.sector,
        companySize: session.companySize,
        roles: session.detectedRoles,
        gdprConsent,
        marketingConsent: marketingConsent ?? false,
        consentDate: new Date(),
        leadStatus: "PRE_AUDIT_DONE",
      },
      update: {
        firstName,
        phone: phone || undefined,
        company: company || undefined,
        sector: session.sector || undefined,
        companySize: session.companySize || undefined,
        roles: session.detectedRoles.length > 0 ? session.detectedRoles : undefined,
        gdprConsent,
        marketingConsent: marketingConsent ?? undefined,
        consentDate: new Date(),
        leadStatus: "PRE_AUDIT_DONE",
      },
    });

    // Associate session with user
    await prisma.session.update({
      where: { id: sessionId },
      data: { userId: user.id },
    });

    // Get or calculate score
    let scoreResult = session.scores[0];
    let scoreFinal = scoreResult?.scoreFinal ?? 0;
    let riskLevel = (scoreResult?.riskLevel ?? "FAIBLE") as any;
    let alerts = (scoreResult?.alerts ?? []) as any[];

    if (!scoreResult && session.answers.length > 0) {
      // Calculate score if not yet done
      const answersForScoring: AnswerWithScore[] = session.answers.map((a) => ({
        questionId: a.questionId,
        questionCode: a.questionCode,
        section: a.section,
        value: a.value as any,
        rawPoints: a.rawPoints,
        dimension: a.dimension,
        isCritical: a.isCritical,
        alertMessage: a.alertMessage,
      }));

      const calculated =
        session.type === "PRE_AUDIT"
          ? calculatePreAuditScore(answersForScoring)
          : calculateDiagnosticScore(answersForScoring);

      scoreFinal = calculated.scoreFinal;
      riskLevel = calculated.riskLevel;
      alerts = calculated.alerts;
    }

    // Get recommended offer
    const primaryRole = (session.detectedRoles[0] as any) ?? "INDETERMINE";
    const recommendation = getRecommendedOffer(
      primaryRole,
      scoreFinal,
      session.sector,
      session.companySize,
      session.type === "PRE_AUDIT" ? "PRE_AUDIT" : "DIAGNOSTIC"
    );

    // Send confirmation email
    await sendConfirmation({ email, name: firstName });

    // Send rapport email with score details
    await sendRapport({
      email,
      name: firstName,
      scoreFinal,
      maxScore: session.type === "PRE_AUDIT" ? 10 : 100,
      riskLevel,
      alerts,
      recommendedOffer: recommendation.primaryOffer,
      ctaUrl: `${process.env.NEXT_PUBLIC_BASE_URL ?? "https://complia.eu"}/rdv/decouverte`,
    });

    // Schedule nurturing emails if marketing consent
    if (marketingConsent) {
      await scheduleNurturing({
        email,
        name: firstName,
        role: primaryRole,
        scoreFinal,
        riskLevel,
        recommendedOffer: recommendation.primaryOffer,
      });
    }

    const response: LeadResponse = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      company: user.company,
      leadStatus: user.leadStatus,
      createdAt: user.createdAt.toISOString(),
    };

    return Response.json(
      { success: true, data: response } satisfies ApiResponse<LeadResponse>,
      { status: 201 }
    );
  } catch (error) {
    console.error("[API] POST /leads error:", error);

    // Handle unique constraint violation (duplicate email race condition)
    if (
      error instanceof Error &&
      error.message.includes("Unique constraint")
    ) {
      return Response.json(
        {
          success: false,
          error: {
            code: "DUPLICATE_EMAIL",
            message:
              "Cette adresse email est deja associee a un compte. Votre session a ete mise a jour.",
          },
        } satisfies ApiResponse<never>,
        { status: 409 }
      );
    }

    return Response.json(
      {
        success: false,
        error: { code: "INTERNAL_ERROR", message: "Erreur interne du serveur" },
      } satisfies ApiResponse<never>,
      { status: 500 }
    );
  }
}
