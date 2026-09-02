import { describe, expect, it, vi } from "vitest";
import { clickedOutsideLanguageMenu, selectLanguageAndClose, toggleLanguageMenu } from "./languageMenu";

describe("language menu behavior", () => {
  it("opens and closes when the trigger toggles", () => {
    expect(toggleLanguageMenu(false)).toBe(true);
    expect(toggleLanguageMenu(true)).toBe(false);
  });

  it("closes when the pointer target is outside the menu", () => {
    const inside = { contains: vi.fn(() => true) };
    const outside = { contains: vi.fn(() => false) };
    expect(clickedOutsideLanguageMenu(inside, {})).toBe(false);
    expect(clickedOutsideLanguageMenu(outside, {})).toBe(true);
  });

  it("closes after selecting a locale", () => {
    const setLocale = vi.fn();
    const close = vi.fn();
    selectLanguageAndClose("en", setLocale, close);
    expect(setLocale).toHaveBeenCalledWith("en");
    expect(close).toHaveBeenCalledOnce();
  });
});
