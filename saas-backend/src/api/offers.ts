import { PrismaClient } from "@prisma/client";
import { offerRecommendSchema, offerQuerySchema } from "../lib/validation";
import { getRecommendedOffer, getOfferBySlug, listAllOffers } from "../lib/recommendations";
import type { ApiResponse, OfferRecommendation, OfferDetail } from "../types";

const prisma = new PrismaClient();

// ─── GET /api/offers/recommend — Get recommended offer for a session ──────────

export async function GET_recommend(
  request: Request
): Promise<Response> {
  try {
    const url = new URL(request.url);
    const sessionId = url.searchParams.get("sessionId");

    // If sessionId provided, fetch from DB
    if (sessionId) {
      const parsed = offerRecommendSchema.safeParse({ sessionId });
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

      const session = await prisma.session.findUnique({
        where: { id: sessionId },
        include: {
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

      const latestScore = session.scores[0];
      if (!latestScore) {
        return Response.json(
          {
            success: false,
            error: {
              code: "NO_SCORE",
              message:
                "Aucun score disponible pour cette session. Completez le diagnostic d'abord.",
            },
          } satisfies ApiResponse<never>,
          { status: 422 }
        );
      }

      const primaryRole = (latestScore.detectedRoles[0] as any) ?? "INDETERMINE";
      const recommendation = getRecommendedOffer(
        primaryRole,
        latestScore.scoreFinal,
        session.sector,
        session.companySize,
        session.type === "PRE_AUDIT" ? "PRE_AUDIT" : "DIAGNOSTIC"
      );

      return Response.json(
        {
          success: true,
          data: recommendation,
        } satisfies ApiResponse<OfferRecommendation>,
        { status: 200 }
      );
    }

    // If no sessionId, use query params for direct recommendation
    const queryParams = {
      role: url.searchParams.get("role") ?? undefined,
      score: url.searchParams.get("score") ?? undefined,
      sector: url.searchParams.get("sector") ?? undefined,
      companySize: url.searchParams.get("companySize") ?? undefined,
    };

    const parsed = offerQuerySchema.safeParse(queryParams);
    if (!parsed.success) {
      return Response.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Parametres invalides",
            details: parsed.error.flatten().fieldErrors,
          },
        } satisfies ApiResponse<never>,
        { status: 400 }
      );
    }

    const { role, score, sector, companySize } = parsed.data;

    // If we have role and score, compute recommendation
    if (role && score !== undefined) {
      const recommendation = getRecommendedOffer(
        role as any,
        score,
        sector ?? null,
        companySize ?? null
      );

      return Response.json(
        {
          success: true,
          data: recommendation,
        } satisfies ApiResponse<OfferRecommendation>,
        { status: 200 }
      );
    }

    // Otherwise, list all offers
    const allOffers = listAllOffers();

    return Response.json(
      {
        success: true,
        data: allOffers,
      } satisfies ApiResponse<OfferDetail[]>,
      { status: 200 }
    );
  } catch (error) {
    console.error("[API] GET /offers/recommend error:", error);
    return Response.json(
      {
        success: false,
        error: { code: "INTERNAL_ERROR", message: "Erreur interne du serveur" },
      } satisfies ApiResponse<never>,
      { status: 500 }
    );
  }
}
