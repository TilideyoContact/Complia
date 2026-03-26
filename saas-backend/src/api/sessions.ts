import { PrismaClient } from "@prisma/client";
import { sessionCreateSchema, sessionCompleteSchema, sessionIdParamSchema } from "../lib/validation";
import { calculatePreAuditScore, calculateDiagnosticScore } from "../lib/scoring";
import { getRecommendedOffer } from "../lib/recommendations";
import type { ApiResponse, SessionResponse, SessionScoreResponse, AnswerWithScore } from "../types";

const prisma = new PrismaClient();

// ─── POST /api/sessions — Start a new session ────────────────────────────────

export async function POST_start(
  request: Request
): Promise<Response> {
  try {
    const body = await request.json();
    const parsed = sessionCreateSchema.safeParse(body);

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

    const { type, metadata } = parsed.data;
    const totalSteps = type === "DIAGNOSTIC" ? 35 : 15;
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    const session = await prisma.session.create({
      data: {
        type,
        status: "IN_PROGRESS",
        currentStep: 0,
        totalSteps,
        metadata: metadata ?? undefined,
        expiresAt,
      },
    });

    const response: SessionResponse = {
      id: session.id,
      type: session.type as any,
      status: session.status as any,
      currentStep: session.currentStep,
      totalSteps: session.totalSteps,
      detectedRoles: session.detectedRoles as any[],
      sector: session.sector,
      companySize: session.companySize,
      startedAt: session.startedAt.toISOString(),
      completedAt: null,
    };

    return Response.json(
      { success: true, data: response } satisfies ApiResponse<SessionResponse>,
      { status: 201 }
    );
  } catch (error) {
    console.error("[API] POST /sessions error:", error);
    return Response.json(
      {
        success: false,
        error: { code: "INTERNAL_ERROR", message: "Erreur interne du serveur" },
      } satisfies ApiResponse<never>,
      { status: 500 }
    );
  }
}

// ─── POST /api/sessions/complete — Complete a session ─────────────────────────

export async function POST_complete(
  request: Request
): Promise<Response> {
  try {
    const body = await request.json();
    const parsed = sessionCompleteSchema.safeParse(body);

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

    const { sessionId } = parsed.data;

    // Fetch session with all answers
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { answers: true },
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

    if (session.status === "COMPLETED") {
      return Response.json(
        {
          success: false,
          error: { code: "ALREADY_COMPLETED", message: "Session deja completee" },
        } satisfies ApiResponse<never>,
        { status: 409 }
      );
    }

    // Transform answers to AnswerWithScore format
    const answersWithScore: AnswerWithScore[] = session.answers.map((a) => ({
      questionId: a.questionId,
      questionCode: a.questionCode,
      section: a.section,
      value: a.value as any,
      rawPoints: a.rawPoints,
      dimension: a.dimension,
      isCritical: a.isCritical,
      alertMessage: a.alertMessage,
    }));

    // Calculate score based on session type
    const isPreAudit = session.type === "PRE_AUDIT";
    const scoreResult = isPreAudit
      ? calculatePreAuditScore(answersWithScore)
      : calculateDiagnosticScore(answersWithScore);

    // Get recommended offer
    const primaryRole = scoreResult.detectedRoles[0] ?? "INDETERMINE";
    const recommendation = getRecommendedOffer(
      primaryRole as any,
      scoreResult.scoreFinal,
      session.sector,
      session.companySize,
      isPreAudit ? "PRE_AUDIT" : "DIAGNOSTIC"
    );

    // Persist score
    await prisma.score.create({
      data: {
        sessionId,
        type: session.type,
        scoreBrut: scoreResult.scoreBrut,
        scoreAjuste: scoreResult.scoreAjuste,
        scoreFinal: scoreResult.scoreFinal,
        maxPossible: isPreAudit ? 10 : 100,
        riskLevel: scoreResult.riskLevel,
        complianceLevel: "complianceLevel" in scoreResult ? scoreResult.complianceLevel : null,
        multiplicateurRole: scoreResult.multiplicateurRole,
        multiplicateurSecteur: scoreResult.multiplicateurSecteur,
        multiplicateurTaille: scoreResult.multiplicateurTaille,
        hasKillSwitch: scoreResult.hasKillSwitch,
        killSwitchDetails: scoreResult.killSwitchDetails as any,
        dimensions: "dimensions" in scoreResult ? (scoreResult.dimensions as any) : null,
        alerts: scoreResult.alerts as any,
        detectedRoles: scoreResult.detectedRoles,
      },
    });

    // Update session status
    await prisma.session.update({
      where: { id: sessionId },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
        detectedRoles: scoreResult.detectedRoles,
        sector: session.sector,
        companySize: session.companySize,
      },
    });

    return Response.json(
      { success: true, data: { score: scoreResult, recommendation } } satisfies ApiResponse<any>,
      { status: 200 }
    );
  } catch (error) {
    console.error("[API] POST /sessions/complete error:", error);
    return Response.json(
      {
        success: false,
        error: { code: "INTERNAL_ERROR", message: "Erreur interne du serveur" },
      } satisfies ApiResponse<never>,
      { status: 500 }
    );
  }
}

// ─── GET /api/sessions/[sessionId]/score — Retrieve session score ─────────────

export async function GET_score(
  request: Request,
  params: { sessionId: string }
): Promise<Response> {
  try {
    const parsed = sessionIdParamSchema.safeParse(params);
    if (!parsed.success) {
      return Response.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Identifiant de session invalide",
          },
        } satisfies ApiResponse<never>,
        { status: 400 }
      );
    }

    const { sessionId } = parsed.data;

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        scores: { orderBy: { calculatedAt: "desc" }, take: 1 },
        recommendations: {
          include: { primaryOffer: true, secondaryOffer: true },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
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

    const latestScore = session.scores[0] ?? null;

    const sessionResponse: SessionResponse = {
      id: session.id,
      type: session.type as any,
      status: session.status as any,
      currentStep: session.currentStep,
      totalSteps: session.totalSteps,
      detectedRoles: session.detectedRoles as any[],
      sector: session.sector,
      companySize: session.companySize,
      startedAt: session.startedAt.toISOString(),
      completedAt: session.completedAt?.toISOString() ?? null,
    };

    // If no score yet, return session only
    if (!latestScore) {
      return Response.json(
        {
          success: true,
          data: { session: sessionResponse, score: null, recommendation: null },
        } satisfies ApiResponse<any>,
        { status: 200 }
      );
    }

    // Reconstruct score result
    const scoreData = {
      scoreBrut: latestScore.scoreBrut,
      scoreAjuste: latestScore.scoreAjuste,
      scoreFinal: latestScore.scoreFinal,
      maxPossible: latestScore.maxPossible,
      riskLevel: latestScore.riskLevel,
      complianceLevel: latestScore.complianceLevel,
      multiplicateurRole: latestScore.multiplicateurRole,
      multiplicateurSecteur: latestScore.multiplicateurSecteur,
      multiplicateurTaille: latestScore.multiplicateurTaille,
      hasKillSwitch: latestScore.hasKillSwitch,
      killSwitchDetails: latestScore.killSwitchDetails,
      dimensions: latestScore.dimensions,
      alerts: latestScore.alerts,
      detectedRoles: latestScore.detectedRoles,
    };

    // Reconstruct recommendation from stored data or recalculate
    const primaryRole = (latestScore.detectedRoles[0] as any) ?? "INDETERMINE";
    const recommendation = getRecommendedOffer(
      primaryRole,
      latestScore.scoreFinal,
      session.sector,
      session.companySize,
      session.type === "PRE_AUDIT" ? "PRE_AUDIT" : "DIAGNOSTIC"
    );

    const result: SessionScoreResponse = {
      session: sessionResponse,
      score: scoreData as any,
      recommendation,
    };

    return Response.json(
      { success: true, data: result } satisfies ApiResponse<SessionScoreResponse>,
      { status: 200 }
    );
  } catch (error) {
    console.error("[API] GET /sessions/score error:", error);
    return Response.json(
      {
        success: false,
        error: { code: "INTERNAL_ERROR", message: "Erreur interne du serveur" },
      } satisfies ApiResponse<never>,
      { status: 500 }
    );
  }
}
