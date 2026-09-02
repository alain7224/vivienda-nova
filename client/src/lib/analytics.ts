export function buildTrackedPage(pathname: string, search: string) {
  const sharedProperty = new URLSearchParams(search).get("property");
  return sharedProperty ? `${pathname}?property=${encodeURIComponent(sharedProperty.slice(0, 160))}` : pathname;
}

export function buildVisitSessionKey(locale: string, page: string) {
  return `vn-visited-${locale}-${page}`;
}
