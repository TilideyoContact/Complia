import { z } from "zod";

// ─── COMMON SCHEMAS ───────────────────────────────────────────────────────────

export const emailSchema = z
  .string()
  .email("Adresse email invalide")
  .min(1, "L'email est requis")
  .max(255, "L'email est trop long")
  .transform((v) => v.toLowerCase().trim());

export const phoneSchema = z
  .string()
  .regex(
    /^(\+33|0)[1-9](\d{2}){4}$/,
    "Format de telephone invalide (ex: +33612345678 ou 0612345678)"
  )
  .optional()
  .or(z.literal(""));

// ─── SESSION SCHEMAS ──────────────────────────────────────────────────────────

export const sessionCreateSchema = z.object({
  type: z.enum(["PRE_AUDIT", "DIAGNOSTIC"]).default("PRE_AUDIT"),
  metadata: z.record(z.unknown()).optional(),
});

export const sessionCompleteSchema = z.object({
  sessionId: z
    .string()
    .min(1, "L'identifiant de session est requis")
    .max(64, "Identifiant de session invalide"),
});

export const sessionIdParamSchema = z.object({
  sessionId: z.string().min(1).max(64),
});

// ─── ANSWER SCHEMAS ───────────────────────────────────────────────────────────

export const answerValueSchema = z.object({
  selected: z.union([
    z.string().min(1, "Une reponse est requise"),
    z
      .array(z.string().min(1))
      .min(1, "Au moins une reponse est requise"),
  ]),
  text: z.string().max(2000, "Le texte est trop long").optional(),
});

export const answerSaveSchema = z.object({
  sessionId: z.string().min(1, "L'identifiant de session est requis"),
  questionId: z
    .string()
    .min(1, "L'identifiant de question est requis")
    .max(32),
  questionCode: z
    .string()
    .min(1, "Le code de question est requis")
    .max(16)
    .regex(/^Q[\w-]+$/, "Format de code invalide (ex: Q1, Q-F-01)"),
  section: z.number().int().min(0).max(20),
  value: answerValueSchema,
});

export const answerBatchSchema = z.object({
  sessionId: z.string().min(1),
  answers: z
    .array(
      z.object({
        questionId: z.string().min(1).max(32),
        questionCode: z.string().min(1).max(16),
        section: z.number().int().min(0).max(20),
        value: answerValueSchema,
      })
    )
    .min(1, "Au moins une reponse est requise")
    .max(50, "Trop de reponses en une seule requete"),
});

// ─── LEAD SCHEMAS ─────────────────────────────────────────────────────────────

export const leadCaptureSchema = z.object({
  email: emailSchema,
  firstName: z
    .string()
    .min(1, "Le prenom est requis")
    .max(100, "Le prenom est trop long")
    .transform((v) => v.trim()),
  phone: phoneSchema,
  company: z
    .string()
    .max(255, "Le nom de l'entreprise est trop long")
    .optional()
    .transform((v) => v?.trim()),
  sessionId: z.string().min(1, "L'identifiant de session est requis"),
  gdprConsent: z.literal(true, {
    errorMap: () => ({
      message:
        "Le consentement RGPD est obligatoire pour acceder au diagnostic",
    }),
  }),
  marketingConsent: z.boolean().default(false),
});

// ─── OFFER SCHEMAS ────────────────────────────────────────────────────────────

export const offerRecommendSchema = z.object({
  sessionId: z.string().min(1, "L'identifiant de session est requis"),
});

export const offerQuerySchema = z.object({
  role: z
    .enum([
      "FOURNISSEUR",
      "DEPLOYEUR",
      "IMPORTATEUR",
      "DISTRIBUTEUR",
      "INDETERMINE",
    ])
    .optional(),
  score: z.coerce.number().min(0).max(100).optional(),
  sector: z.string().optional(),
  companySize: z.string().optional(),
});

// ─── GDPR SCHEMAS ─────────────────────────────────────────────────────────────

export const gdprDeleteSchema = z.object({
  email: emailSchema,
  confirmDeletion: z.literal(true, {
    errorMap: () => ({
      message:
        "Vous devez confirmer explicitement la suppression de vos donnees",
    }),
  }),
});

// ─── EXPORT INFERRED TYPES ───────────────────────────────────────────────────

export type SessionCreateInput = z.infer<typeof sessionCreateSchema>;
export type SessionCompleteInput = z.infer<typeof sessionCompleteSchema>;
export type AnswerSaveInput = z.infer<typeof answerSaveSchema>;
export type AnswerBatchInput = z.infer<typeof answerBatchSchema>;
export type LeadCaptureInput = z.infer<typeof leadCaptureSchema>;
export type OfferRecommendInput = z.infer<typeof offerRecommendSchema>;
export type OfferQueryInput = z.infer<typeof offerQuerySchema>;
export type GdprDeleteInput = z.infer<typeof gdprDeleteSchema>;
