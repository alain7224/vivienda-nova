import { describe, expect, it } from "vitest";
import { buildTrackedPage, buildVisitSessionKey } from "./analytics";

describe("analytics tracking", () => {
  it("keeps only the shared property identifier in the tracked page", () => {
    expect(buildTrackedPage("/", "?property=chalet-torrevieja&utm_source=campaign")).toBe("/?property=chalet-torrevieja");
  });

  it("uses a stable session key per locale and page", () => {
    expect(buildVisitSessionKey("es", "/?property=chalet")).toBe("vn-visited-es-/?property=chalet");
  });
});
