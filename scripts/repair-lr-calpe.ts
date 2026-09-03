import { importLrCostaHomesUrl } from "../server/lrCostaHomes";
import { createProperty, listAdminProperties, updateProperty } from "../server/db";

const sourceUrl = "https://lrcostahomes.com/es/property/apartment-in-calpe/";
const draft = await importLrCostaHomesUrl(sourceUrl);
const existing = (await listAdminProperties()).find((property) => property.externalUrl === sourceUrl);
const values = { ...draft, imageGallery: JSON.stringify(draft.imageGallery) };
const id = existing ? existing.id : await createProperty(values);
if (existing) await updateProperty(existing.id, values);
console.log(JSON.stringify({ id, title: draft.title, images: draft.imageGallery.length }));
