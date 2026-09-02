export function clickedOutsideLanguageMenu(menu: { contains: (node: Node | null) => boolean } | null, target: EventTarget | null) {
  return !menu?.contains(target as Node | null);
}

export function toggleLanguageMenu(currentlyOpen: boolean) {
  return !currentlyOpen;
}

export function selectLanguageAndClose<T extends string>(code: T, setLocale: (next: T) => void, close: () => void) {
  setLocale(code);
  close();
}
