export type OrderableProperty = {
  id: number;
  title: string;
  type: string;
  zone: string;
  city: string;
  tag: string;
  priceValue: number;
  surface: number;
  bedrooms: number;
  imageGallery?: string[];
};

export const PROPERTIES_PER_PAGE = 9;

export function parsePropertyOrder(source?: string | null): number[] {
  try {
    const ids = JSON.parse(source || "[]");
    return Array.isArray(ids) ? ids.filter((id): id is number => Number.isInteger(id) && id > 0) : [];
  } catch {
    return [];
  }
}

export function featuredScore(property: OrderableProperty) {
  const text = `${property.title} ${property.type} ${property.zone} ${property.city} ${property.tag}`.toLowerCase();
  return (/(playa|mar|beach|sea|costa|piscina)/.test(text) ? 6 : 0) + (/(chalet|villa|casa|adosado|bungalow)/.test(text) ? 4 : 0) + (property.imageGallery?.length ? 1 : 0);
}

export function sortProperties<T extends OrderableProperty>(properties: T[], order: string, manualOrder: number[]) {
  return properties.slice().sort((first, second) => {
    if (order === "price-low") return first.priceValue - second.priceValue;
    if (order === "price-high") return second.priceValue - first.priceValue;
    if (order === "surface-low") return first.surface - second.surface;
    if (order === "surface-high") return second.surface - first.surface;
    if (order === "bedrooms") return second.bedrooms - first.bedrooms;
    if (order === "manual") {
      const firstPosition = manualOrder.indexOf(first.id);
      const secondPosition = manualOrder.indexOf(second.id);
      return (firstPosition < 0 ? Number.MAX_SAFE_INTEGER : firstPosition) - (secondPosition < 0 ? Number.MAX_SAFE_INTEGER : secondPosition);
    }
    return featuredScore(second) - featuredScore(first);
  });
}

export function getPage<T>(items: T[], page: number, perPage = PROPERTIES_PER_PAGE) {
  const safePage = Math.max(0, Math.min(page, Math.max(0, Math.ceil(items.length / perPage) - 1)));
  return items.slice(safePage * perPage, (safePage + 1) * perPage);
}

export function pageCount(items: unknown[], perPage = PROPERTIES_PER_PAGE) {
  return Math.ceil(items.length / perPage);
}
