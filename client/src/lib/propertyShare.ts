export type ShareableProperty = { slug: string; title: string; city: string; price: string };

export function createPropertyShareUrl(origin: string, slug: string) {
  const url = new URL("/", origin);
  url.searchParams.set("property", slug);
  url.hash = "viviendas";
  return url.toString();
}

export function createPropertyShareText(property: ShareableProperty) {
  return `${property.title} · ${property.city} · ${property.price}`;
}

export function createPropertyShareTargets(propertyUrl: string, shareText: string) {
  const encodedUrl = encodeURIComponent(propertyUrl);
  const encodedText = encodeURIComponent(shareText);
  return {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${propertyUrl}`)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    x: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
  };
}
