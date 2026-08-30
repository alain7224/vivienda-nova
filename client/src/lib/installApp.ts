export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export function isIosDevice(userAgent: string) {
  return /iPad|iPhone|iPod/i.test(userAgent);
}

export function isIosSafari(userAgent: string) {
  return isIosDevice(userAgent) && /Safari/i.test(userAgent) && !/CriOS|FxiOS|EdgiOS|OPiOS|GSA/i.test(userAgent);
}

export function isStandaloneMode(displayModeMatches: boolean, navigatorStandalone?: boolean) {
  return displayModeMatches || navigatorStandalone === true;
}
