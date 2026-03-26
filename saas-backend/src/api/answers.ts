import { PrismaClient } from "@prisma/client";
import { answerSaveSchema } from "../lib/validation";
import { evaluateAnswer, recalculatePartialScore } from "../lib/scoring";
import type { ApiResponse, AnswerWithScore } from "../types";

const prisma = new PrismaClient();

// ─── POST /api/answers — Save an answer and trigger partial score recalc ──────

export async function POST_save(
  request: Request
): Promise<Response> {
  try {
    const body = await request.json();
    const parsed = answerSaveSchema.safeParse(body);

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

    const { sessionId, questionId, questionCode, section, value } = parsed.data;

    // Verify session exists and is in progress
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
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

    if (session.status !== "IN_PROGRESS") {
      return Response.json(
        {
          success: false,
          error: {
            code: "SESSION_CLOSED",
            message: "La session est deja terminee ou expiree",
          },
        } satisfies ApiResponse<never>,
        { status: 409 }
      );
    }

    // Check expiration
    if (session.expiresAt && session.expiresAt < new Date()) {
      await prisma.session.update({
        where: { id: sessionId },
        data: { status: "EXPIRED" },
      });
      return Response.json(
        {
          success: false,
          error: {
            code: "SESSION_EXPIRED",
            message: "La session a expire. Veuillez en commencer une nouvelle.",
          },
        } satisfies ApiResponse<never>,
        { status: 410 }
      );
    }

    // Evaluate the answer
    const evaluation = evaluateAnswer(
      questionCode,
      value,
      session.detectedRoles[0] as any
    );

    // Upsert the answer (allow re-answering a question)
    const answer = await prisma.answer.upsert({
      where: {
        sessionId_questionId: {
          sessionId,
          questionId,
        },
      },
      create: {
        sessionId,
        questionId,
        questionCode,
        section,
        value: value as any,
        rawPoints: evaluation.rawPoints,
        dimension: evaluation.dimension,
        isCritical: evaluation.isCritical,
        alertMessage: evaluation.alertMessage,
      },
      update: {
        value: value as any,
        rawPoints: evaluation.rawPoints,
        dimension: evaluation.dimension,
        isCritical: evaluation.isCritical,
        alertMessage: evaluation.alertMessage,
        updatedAt: new Date(),
      },
    });

    // Update session's detected roles and sector if relevant
    const updateData: Record<string, any> = {
      currentStep: Math.max(session.currentStep, section),
    };

    // Detect role from Q1
    if (questionCode === "Q1") {
      const sel = (
        Array.isArray(value.selected) ? value.selected[0] : value.selected
      ).toLowerCase();
      let role: string | null = null;
      if (sel.includes("developp") || sel === "a") role = "FOURNISSEUR";
      else if (sel.includes("utilis") || sel === "b") role = "DEPLOYEUR";
      else if (sel.includes("import") || sel === "c") role = "IMPORTATEUR";
      else if (sel.includes("distribu") || sel.includes("revend") || sel === "d")
        role = "DISTRIBUTEUR";
      else role = "INDETERMINE";
      if (role) {
        updateData.detectedRoles = [role];
      }
    }

    // Detect sector from Q2
    if (questionCode === "Q2") {
      const sel = Array.isArray(value.selected)
        ? value.selected[0]
        : value.selected;
      updateData.sector = sel.toLowerCase();
    }

    // Detect company size from Q3
    if (questionCode === "Q3") {
      const sel = Array.isArray(value.selected)
        ? value.selected[0]
        : value.selected;
      updateData.companySize = sel.toLowerCase();
    }

    await prisma.session.update({
      where: { id: sessionId },
      data: updateData,
    });

    // Fetch all current answers for partial score recalculation
    const allAnswers = await prisma.answer.findMany({
      where: { sessionId },
      orderBy: { section: "asc" },
    });

    const answersForScoring: AnswerWithScore[] = allAnswers.map((a) => ({
      questionId: a.questionId,
      questionCode: a.questionCode,
      section: a.section,
      value: a.value as any,
      rawPoints: a.rawPoints,
      dimension: a.dimension,
      isCritical: a.isCritical,
      alertMessage: a.alertMessage,
    }));

    const partialScore = recalculatePartialScore(
      answersForScoring,
      session.type as any,
      session.detectedRoles[0] as any,
      updateData.sector ?? session.sector ?? undefined,
      updateData.companySize ?? session.companySize ?? undefined
    );

    return Response.json(
      {
        success: true,
        data: {
          answerId: answer.id,
          evaluation: {
            rawPoints: evaluation.rawPoints,
            dimension: evaluation.dimension,
            isCritical: evaluation.isCritical,
            alertMessage: evaluation.alertMessage,
          },
          partialScore: {
            scoreFinal: partialScore.scoreFinal,
            riskLevel: partialScore.riskLevel,
            hasKillSwitch: partialScore.hasKillSwitch,
            alertCount: partialScore.alerts.length,
          },
          progress: {
            answeredQuestions: allAnswers.length,
            currentStep: updateData.currentStep ?? session.currentStep,
            totalSteps: session.totalSteps,
            percentage: Math.round(
              (allAnswers.length / session.totalSteps) * 100
            ),
          },
        },
      } satisfies ApiResponse<any>,
      { status: 200 }
    );
  } catch (error) {
    console.error("[API] POST /answers error:", error);
    return Response.json(
      {
        success: false,
        error: { code: "INTERNAL_ERROR", message: "Erreur interne du serveur" },
      } satisfies ApiResponse<never>,
      { status: 500 }
    );
  }
}
