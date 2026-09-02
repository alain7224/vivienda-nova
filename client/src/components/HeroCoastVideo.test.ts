import { describe, expect, it } from "vitest";
import { getHeroMediaState } from "./HeroCoastVideo";

describe("getHeroMediaState", () => {
  it("keeps the real poster visible until the video can play", () => {
    expect(getHeroMediaState(true, false, false)).toBe("poster");
  });

  it("reveals the video only after it is ready and falls back on error", () => {
    expect(getHeroMediaState(true, true, false)).toBe("video");
    expect(getHeroMediaState(true, true, true)).toBe("fallback");
    expect(getHeroMediaState(false, false, false)).toBe("fallback");
  });
});
