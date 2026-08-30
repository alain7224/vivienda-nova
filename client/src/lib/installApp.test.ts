import { describe, expect, it } from "vitest";
import { isIosDevice, isIosSafari, isStandaloneMode } from "./installApp";

describe("installable app helpers", () => {
  it("detects iPhone and iPad browsers for the Safari installation guide", () => {
    expect(isIosDevice("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)")).toBe(true);
    expect(isIosDevice("Mozilla/5.0 (Linux; Android 14; Pixel 8)")).toBe(false);
  });

  it("shows the Safari-specific guide only in Safari on iOS", () => {
    expect(isIosSafari("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1")).toBe(true);
    expect(isIosSafari("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/537.36 CriOS/120.0.0.0 Mobile/15E148 Safari/604.1")).toBe(false);
  });

  it("recognises standalone display mode", () => {
    expect(isStandaloneMode(true)).toBe(true);
    expect(isStandaloneMode(false, true)).toBe(true);
    expect(isStandaloneMode(false)).toBe(false);
  });
});
