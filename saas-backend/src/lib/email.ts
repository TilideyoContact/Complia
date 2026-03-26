import { Resend } from "resend";
import type {
  EmailConfirmationData,
  EmailRapportData,
  NurturingSchedule,
  RiskLevel,
  OfferDetail,
  Alert,
} from "../types";

// ─── RESEND CLIENT ────────────────────────────────────────────────────────────

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.FROM_EMAIL ?? "diagnostic@complia.eu";
const FROM_NAME = process.env.FROM_NAME ?? "Complia";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://complia.eu";

// ─── TEMPLATE LOADER ──────────────────────────────────────────────────────────

function loadTemplate(templateName: string): string {
  // In production, templates would be loaded from the emails/ directory.
  // Here we use a dynamic import pattern compatible with build tools.
  const fs = require("fs");
  const path = require("path");
  const templatePath = path.join(
    __dirname,
    "..",
    "..",
    "emails",
    `${templateName}.html`
  );
  return fs.readFileSync(templatePath, "utf-8");
}

function interpolate(
  template: string,
  variables: Record<string, string>
): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`{{${key}}}`, "g"), value);
  }
  return result;
}

// ─── RISK LEVEL HELPERS ───────────────────────────────────────────────────────

function getRiskColor(riskLevel: RiskLevel): string {
  const colors: Record<RiskLevel, string> = {
    FAIBLE: "#38A169",
    MODERE: "#F59E0B",
    ELEVE: "#F97316",
    CRITIQUE: "#E53E3E",
  };
  return colors[riskLevel] ?? "#E53E3E";
}

function getRiskLabel(riskLevel: RiskLevel): string {
  const labels: Record<RiskLevel, string> = {
    FAIBLE: "Faible",
    MODERE: "Modere",
    ELEVE: "Eleve",
    CRITIQUE: "Critique",
  };
  return labels[riskLevel] ?? "Indetermine";
}

function formatAlerts(alerts: Alert[]): string {
  return alerts
    .slice(0, 3)
    .map(
      (a) =>
        `<tr>
          <td style="padding: 12px 16px; border-left: 4px solid ${a.severity === "CRITIQUE" ? "#E53E3E" : a.severity === "ATTENTION" ? "#F97316" : "#F59E0B"}; background: ${a.severity === "CRITIQUE" ? "#FFF5F5" : "#FFFAF0"}; margin-bottom: 8px; border-radius: 0 4px 4px 0;">
            <strong style="color: ${a.severity === "CRITIQUE" ? "#E53E3E" : "#DD6B20"};">${a.title}</strong><br>
            <span style="color: #4A5568; font-size: 14px;">${a.message}</span><br>
            <span style="color: #A0AEC0; font-size: 12px;">${a.reference}</span>
          </td>
        </tr>`
    )
    .join("\n");
}

// ─── SEND CONFIRMATION ───────────────────────────────────────────────────────

export async function sendConfirmation(
  data: EmailConfirmationData
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const template = loadTemplate("confirmation");
    const html = interpolate(template, {
      name: data.name,
      baseUrl: BASE_URL,
      year: new Date().getFullYear().toString(),
    });

    const result = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: data.email,
      subject: "Votre diagnostic Complia est pret",
      html,
    });

    return { success: true, messageId: result.data?.id };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erreur inconnue";
    console.error("[Email] sendConfirmation failed:", message);
    return { success: false, error: message };
  }
}

// ─── SEND RAPPORT ─────────────────────────────────────────────────────────────

export async function sendRapport(
  data: EmailRapportData
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const template = loadTemplate("rapport");
    const scorePercentage = Math.round(
      (data.scoreFinal / data.maxScore) * 100
    );
    const html = interpolate(template, {
      name: data.name ?? "Cher client",
      scoreFinal: data.scoreFinal.toString(),
      maxScore: data.maxScore.toString(),
      scorePercentage: scorePercentage.toString(),
      riskLevel: getRiskLabel(data.riskLevel),
      riskColor: getRiskColor(data.riskLevel),
      alertsHtml: formatAlerts(data.alerts),
      offerName: data.recommendedOffer.name,
      offerPrice: data.recommendedOffer.priceDisplay,
      offerDescription: data.recommendedOffer.description,
      ctaUrl: data.ctaUrl || `${BASE_URL}/rdv/decouverte`,
      baseUrl: BASE_URL,
      year: new Date().getFullYear().toString(),
    });

    const result = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: data.email,
      subject: `Votre score Complia : ${data.scoreFinal}/${data.maxScore} - Niveau ${getRiskLabel(data.riskLevel)}`,
      html,
    });

    return { success: true, messageId: result.data?.id };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erreur inconnue";
    console.error("[Email] sendRapport failed:", message);
    return { success: false, error: message };
  }
}

// ─── SCHEDULE NURTURING ───────────────────────────────────────────────────────

export async function scheduleNurturing(
  data: NurturingSchedule
): Promise<{
  success: boolean;
  scheduledEmails: { day: number; scheduledAt: string }[];
  error?: string;
}> {
  const scheduledEmails: { day: number; scheduledAt: string }[] = [];

  try {
    const now = new Date();

    // J+1: "Ce que le diagnostic complet revele en plus"
    const j1Date = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const j1Template = loadTemplate("nurturing-j1");
    const j1Html = interpolate(j1Template, {
      name: data.name,
      scoreFinal: data.scoreFinal.toString(),
      riskLevel: getRiskLabel(data.riskLevel),
      riskColor: getRiskColor(data.riskLevel),
      role: data.role,
      offerName: data.recommendedOffer.name,
      offerPrice: data.recommendedOffer.priceDisplay,
      ctaUrl: `${BASE_URL}/rdv/decouverte`,
      baseUrl: BASE_URL,
      year: new Date().getFullYear().toString(),
    });

    await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: data.email,
      subject:
        "Ce que le diagnostic complet revele en plus de votre pre-audit",
      html: j1Html,
      scheduledAt: j1Date.toISOString(),
    });
    scheduledEmails.push({ day: 1, scheduledAt: j1Date.toISOString() });

    // J+3: Urgency - "J'ai le temps" objection handling
    const j3Date = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const deadline = new Date("2026-08-02");
    const daysRemaining = Math.ceil(
      (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    const j3Template = loadTemplate("nurturing-j3");
    const j3Html = interpolate(j3Template, {
      name: data.name,
      daysRemaining: daysRemaining.toString(),
      scoreFinal: data.scoreFinal.toString(),
      riskLevel: getRiskLabel(data.riskLevel),
      riskColor: getRiskColor(data.riskLevel),
      ctaUrl: `${BASE_URL}/rdv/decouverte`,
      baseUrl: BASE_URL,
      year: new Date().getFullYear().toString(),
    });

    await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: data.email,
      subject: `${daysRemaining} jours avant l'echeance AI Act - Etes-vous pret ?`,
      html: j3Html,
      scheduledAt: j3Date.toISOString(),
    });
    scheduledEmails.push({ day: 3, scheduledAt: j3Date.toISOString() });

    // J+7: Launch offer + payment facilities
    const j7Date = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const j7Template = loadTemplate("nurturing-j7");
    const j7Html = interpolate(j7Template, {
      name: data.name,
      offerName: data.recommendedOffer.name,
      offerPrice: data.recommendedOffer.priceDisplay,
      ctaUrl: `${BASE_URL}/rdv/decouverte`,
      baseUrl: BASE_URL,
      year: new Date().getFullYear().toString(),
    });

    await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: data.email,
      subject:
        "Offre de lancement Complia - Paiement en 3x sans frais disponible",
      html: j7Html,
      scheduledAt: j7Date.toISOString(),
    });
    scheduledEmails.push({ day: 7, scheduledAt: j7Date.toISOString() });

    return { success: true, scheduledEmails };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erreur inconnue";
    console.error("[Email] scheduleNurturing failed:", message);
    return { success: false, scheduledEmails, error: message };
  }
}
