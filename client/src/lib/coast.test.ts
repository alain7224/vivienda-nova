import { describe, expect, it } from "vitest";
import { matchesCoast } from "./coast";

describe("matchesCoast", () => {
  it("relaciona Torrevieja con Costa Blanca Sur", () => {
    expect(matchesCoast("Costa Blanca Sur", "Torrevieja", "Los Balcones")).toBe(true);
  });

  it("evita mezclar ubicaciones de costas distintas", () => {
    expect(matchesCoast("Costa del Sol", "Torrevieja", "Los Balcones")).toBe(false);
  });

  it("no limita resultados sin costa seleccionada", () => {
    expect(matchesCoast("", "Madrid", "Chamberí")).toBe(true);
  });
});
