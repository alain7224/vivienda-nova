/** Reglas de consentimiento que protegen los formularios públicos de Vivienda Nova. */
export function createLeadConsentTimestamps(input: { privacyAccepted: boolean; referralConsent: boolean }) {
  if (!input.privacyAccepted) throw new Error("Debes aceptar la política de privacidad para enviar tu consulta.");
  if (!input.referralConsent) throw new Error("Debes autorizar la derivación de tus datos al vendedor o equipo seleccionado.");
  const now = new Date();
  return { privacyAcceptedAt: now, referralConsentAt: now };
}
