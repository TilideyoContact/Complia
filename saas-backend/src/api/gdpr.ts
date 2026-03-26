import { PrismaClient } from "@prisma/client";
import { gdprDeleteSchema } from "../lib/validation";
import type { ApiResponse, GdprDeleteResponse } from "../types";

const prisma = new PrismaClient();

// ─── DELETE /api/gdpr — Delete all user data (RGPD Art. 17) ──────────────────

export async function DELETE_userData(
  request: Request
): Promise<Response> {
  try {
    const body = await request.json();
    const parsed = gdprDeleteSchema.safeParse(body);

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

    const { email } = parsed.data;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        sessions: {
          include: {
            answers: true,
            scores: true,
            recommendations: true,
          },
        },
        appointments: true,
      },
    });

    if (!user) {
      return Response.json(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message:
              "Aucun compte trouve avec cette adresse email. Si vous pensez que c'est une erreur, contactez-nous a dpo@complia.eu.",
          },
        } satisfies ApiResponse<never>,
        { status: 404 }
      );
    }

    // Count entities to be deleted
    const sessionIds = user.sessions.map((s) => s.id);
    let answersCount = 0;
    let scoresCount = 0;
    let recommendationsCount = 0;

    for (const session of user.sessions) {
      answersCount += session.answers.length;
      scoresCount += session.scores.length;
      recommendationsCount += session.recommendations.length;
    }

    // Delete in correct order (respecting foreign keys)
    // 1. Delete recommendations
    if (sessionIds.length > 0) {
      await prisma.recommendation.deleteMany({
        where: { sessionId: { in: sessionIds } },
      });

      // 2. Delete scores
      await prisma.score.deleteMany({
        where: { sessionId: { in: sessionIds } },
      });

      // 3. Delete answers
      await prisma.answer.deleteMany({
        where: { sessionId: { in: sessionIds } },
      });

      // 4. Delete sessions
      await prisma.session.deleteMany({
        where: { id: { in: sessionIds } },
      });
    }

    // 5. Delete appointments
    await prisma.appointment.deleteMany({
      where: { userId: user.id },
    });

    // 6. Delete user
    await prisma.user.delete({
      where: { id: user.id },
    });

    const deleteResponse: GdprDeleteResponse = {
      success: true,
      deletedEntities: {
        user: true,
        sessions: sessionIds.length,
        answers: answersCount,
        scores: scoresCount,
        recommendations: recommendationsCount,
        appointments: user.appointments.length,
      },
      deletedAt: new Date().toISOString(),
    };

    console.log(
      `[GDPR] User data deleted for ${email}. Entities: ${JSON.stringify(deleteResponse.deletedEntities)}`
    );

    return Response.json(
      {
        success: true,
        data: deleteResponse,
      } satisfies ApiResponse<GdprDeleteResponse>,
      { status: 200 }
    );
  } catch (error) {
    console.error("[API] DELETE /gdpr error:", error);
    return Response.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message:
            "Erreur lors de la suppression. Contactez dpo@complia.eu pour une suppression manuelle.",
        },
      } satisfies ApiResponse<never>,
      { status: 500 }
    );
  }
}
