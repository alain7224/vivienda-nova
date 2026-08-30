import { describe, expect, it } from "vitest";
import { readCsv } from "./PropertyImporter";

const headers = "title;slug;address;city;zone;province;country;type;price;priceValue;bedrooms;bathrooms;surface;description;imageUrl;tag;status;linkMode;vendorId;externalUrl;referralParameter;referralCode";
const row = "Casa de la luz;casa-de-la-luz;Calle 1;Marbella;Sierra Blanca;Málaga;España;Casa;900000 €;900000;3;2;180;Una casa luminosa con patio.;https://images.example/casa.jpg;Nueva;published;redirect;;https://seller.example/casa;ref;MARTINEZ";

describe("readCsv", () => {
  it("accepts a valid published property with a direct seller URL", () => {
    const result = readCsv(`${headers}\n${row}`);
    expect(result.errors).toEqual([]);
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0]?.referralCode).toBe("MARTINEZ");
  });

  it("rejects a published property without a direct seller URL", () => {
    const noSellerUrl = row.replace("https://seller.example/casa", "");
    const result = readCsv(`${headers}\n${noSellerUrl}`);
    expect(result.rows).toHaveLength(0);
    expect(result.errors[0]).toContain("necesita externalUrl");
  });
});
