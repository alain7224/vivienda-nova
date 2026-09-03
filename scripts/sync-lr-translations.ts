import { listAdminProperties, replacePropertyTranslations } from "../server/db";
import { translatePropertyCopy } from "../server/translation";

const properties = (await listAdminProperties()).filter((property) => property.externalUrl?.startsWith("https://lrcostahomes.com/"));
const concurrency = 4;
let cursor = 0;
let synced = 0;
let failed = 0;

async function worker() {
  while (true) {
    const index = cursor++;
    if (index >= properties.length) return;
    const property = properties[index];
    try {
      const translations = await translatePropertyCopy({ title: property.title, city: property.city, zone: property.zone, type: property.type, tag: property.tag, description: property.description });
      await replacePropertyTranslations(property.id, translations);
      synced += 1;
      console.log(`[${index + 1}/${properties.length}] traducida: ${property.title}`);
    } catch (error) {
      failed += 1;
      console.error(`[${index + 1}/${properties.length}] ERROR ${property.id}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
await Promise.all(Array.from({ length: concurrency }, worker));
console.log(JSON.stringify({ total: properties.length, synced, failed }));
