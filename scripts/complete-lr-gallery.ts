import { importLrCostaHomesUrl } from "../server/lrCostaHomes";
import { listAdminProperties, updateProperty } from "../server/db";

const sourceUrls = [
  "https://lrcostahomes.com/es/property/apartments-bungalows-and-villas/",
  "https://lrcostahomes.com/es/property/apartments-in-calpe/",
  "https://lrcostahomes.com/es/property/villa-7/",
  "https://lrcostahomes.com/es/property/villa-in-finestrat/",
  "https://lrcostahomes.com/es/property/townhouses/",
];

for (const sourceUrl of sourceUrls) {
  const draft = await importLrCostaHomesUrl(sourceUrl);
  const properties = await listAdminProperties();
  const existing = properties.find((property) => property.externalUrl === sourceUrl);
  if (!existing) {
    console.warn(`No se encontró la ficha existente para ${sourceUrl}`);
    continue;
  }
  await updateProperty(existing.id, { imageUrl: draft.imageUrl, imageGallery: JSON.stringify(draft.imageGallery), status: "published", linkMode: "capture", externalUrl: sourceUrl });
  console.log(`${existing.id}: ${draft.imageGallery.length} imágenes copiadas y ficha publicada internamente`);
}
