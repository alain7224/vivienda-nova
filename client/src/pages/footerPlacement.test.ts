import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("./Home.tsx", import.meta.url), "utf8");
const appSource = readFileSync(new URL("../App.tsx", import.meta.url), "utf8");

describe("public admin access placement", () => {
  it("renders the admin access from the public footer", () => {
    expect(homeSource).toContain('<footer className="site-footer">');
    expect(homeSource).toContain("<AdminFloatingButton />");
    expect(homeSource).toMatch(/site-footer__links[\s\S]*<AdminFloatingButton \/>/);
  });

  it("does not mount the admin access globally from App", () => {
    expect(appSource).not.toContain("AdminFloatingButton");
  });
});
