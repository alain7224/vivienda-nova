import { type Locale, type getCopy } from "./i18n";

export type BusinessMode = "real_estate" | "catalog";
type PublicCopy = ReturnType<typeof getCopy>;

const catalogOverrides: Record<Locale, Partial<PublicCopy>> = {
  es: { homes: "Productos", build: "Pedido especial", title: "Encuentra algo que encaje contigo.", description: "Productos seleccionados y atención directa para consultar disponibilidad y condiciones.", explore: "Ver productos", search: "Explorar catálogo", portfolio: "Disponible ahora", viewSeller: "Consultar producto", direct: "Selección directa", constructionKicker: "Pedido especial", constructionTitle: "Lo que buscas, a medida.", constructionText: "Cuéntanos qué necesitas. Revisaremos tu solicitud y te pondremos en contacto con el equipo adecuado.", constructionCta: "Cuéntanos qué buscas", empty: "Tu próximo producto puede aparecer aquí.", emptyText: "Actualizamos el catálogo con una selección breve y deliberada." },
  en: { homes: "Products", build: "Special request", title: "Find something that fits you.", description: "Selected products with direct support to check availability and terms.", explore: "View products", search: "Browse catalogue", portfolio: "Available now", viewSeller: "Ask about product", direct: "Direct selection", constructionKicker: "Special request", constructionTitle: "What you need, made to fit.", constructionText: "Tell us what you need. We will review your request and connect you with the right team.", constructionCta: "Tell us what you need", empty: "Your next product may appear here.", emptyText: "We update the catalogue with a brief, deliberate selection." },
  nl: { homes: "Producten", build: "Speciale aanvraag", title: "Vind iets dat bij u past.", explore: "Producten bekijken", search: "Catalogus bekijken", portfolio: "Nu beschikbaar", viewSeller: "Product bekijken", direct: "Directe selectie" },
  de: { homes: "Produkte", build: "Sonderanfrage", title: "Finden Sie etwas, das zu Ihnen passt.", explore: "Produkte entdecken", search: "Katalog entdecken", portfolio: "Jetzt verfügbar", viewSeller: "Produkt anfragen", direct: "Direkte Auswahl" },
  sv: { homes: "Produkter", build: "Specialförfrågan", title: "Hitta något som passar dig.", explore: "Utforska produkter", search: "Utforska katalog", portfolio: "Tillgängligt nu", viewSeller: "Fråga om produkt", direct: "Direkt urval" },
  no: { homes: "Produkter", build: "Spesialforespørsel", title: "Finn noe som passer deg.", explore: "Utforsk produkter", search: "Utforsk katalog", portfolio: "Tilgjengelig nå", viewSeller: "Spør om produkt", direct: "Direkte utvalg" },
  fr: { homes: "Produits", build: "Demande spéciale", title: "Trouvez ce qui vous correspond.", explore: "Voir les produits", search: "Explorer le catalogue", portfolio: "Disponible maintenant", viewSeller: "Demander le produit", direct: "Sélection directe" },
  ro: { homes: "Produse", build: "Cerere specială", title: "Găsește ceva potrivit pentru tine.", explore: "Vezi produsele", search: "Explorează catalogul", portfolio: "Disponibil acum", viewSeller: "Întreabă despre produs", direct: "Selecție directă" },
  ru: { homes: "Товары", build: "Специальный запрос", title: "Найдите то, что вам подходит.", explore: "Смотреть товары", search: "Смотреть каталог", portfolio: "Доступно сейчас", viewSeller: "Узнать о товаре", direct: "Прямой выбор" },
  "zh-CN": { homes: "产品", build: "特殊需求", title: "找到适合您的产品。", explore: "查看产品", search: "浏览目录", portfolio: "当前可用", viewSeller: "咨询产品", direct: "直接精选" },
  "de-CH": { homes: "Produkte", build: "Sonderanfrage", title: "Finden Sie etwas, das zu Ihnen passt.", explore: "Produkte entdecken", search: "Katalog entdecken", portfolio: "Jetzt verfügbar", viewSeller: "Produkt anfragen", direct: "Direkte Auswahl" },
  "fr-CH": { homes: "Produits", build: "Demande spéciale", title: "Trouvez ce qui vous correspond.", explore: "Voir les produits", search: "Explorer le catalogue", portfolio: "Disponible maintenant", viewSeller: "Demander le produit", direct: "Sélection directe" },
  "it-CH": { homes: "Prodotti", build: "Richiesta speciale", title: "Trova qualcosa adatto a te.", explore: "Vedi i prodotti", search: "Esplora il catalogo", portfolio: "Disponibili ora", viewSeller: "Chiedi del prodotto", direct: "Selezione diretta" },
};

export function getBusinessModeCopy(mode: BusinessMode, locale: Locale, copy: PublicCopy): PublicCopy {
  return mode === "catalog" ? { ...copy, ...catalogOverrides[locale] } : copy;
}
