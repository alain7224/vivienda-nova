import { discoverLrCostaHomesUrls, importLrCostaHomesUrl } from "../server/lrCostaHomes";
import { createProperty, listAdminProperties, updateProperty } from "../server/db";

const urls = await discoverLrCostaHomesUrls();
const existing = await listAdminProperties();
const bySource = new Map(existing.map((property) => [property.externalUrl, property]));
let imported = 0;
let refreshed = 0;
let failed = 0;

for (const [index, sourceUrl] of urls.entries()) {
  try {
    const draft = await importLrCostaHomesUrl(sourceUrl);
    const current = bySource.get(sourceUrl);
    const values = { ...draft, imageGallery: JSON.stringify(draft.imageGallery) };
    if (current) {
      await updateProperty(current.id, { imageUrl: draft.imageUrl, imageGallery: values.imageGallery, status: "published", linkMode: "capture", externalUrl: sourceUrl });
      refreshed += 1;
    } else {
      const id = await createProperty(values);
      bySource.set(sourceUrl, { ...draft, id, imageGallery: values.imageGallery } as never);
      imported += 1;
    }
    console.log(`[${index + 1}/${urls.length}] ${current ? "actualizada" : "importada"}: ${draft.title} (${draft.imageGallery.length} imágenes)`);
  } catch (error) {
    failed += 1;
    console.error(`[${index + 1}/${urls.length}] ERROR ${sourceUrl}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

console.log(JSON.stringify({ discovered: urls.length, imported, refreshed, failed }));
