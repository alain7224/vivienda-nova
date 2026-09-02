export const ADMIN_KEY_SESSION_MARKER = "vivienda-nova-admin-key";
export const PREVIEW_SESSION_TOKEN = "manus-cookie";

export function activateAdminKeySession(storage: Pick<Storage, "removeItem" | "setItem">) {
  storage.removeItem(PREVIEW_SESSION_TOKEN);
  storage.setItem(ADMIN_KEY_SESSION_MARKER, "1");
}

export function completeAdminKeyLogin(
  storage: Pick<Storage, "removeItem" | "setItem">,
  navigate: (path: string) => void,
) {
  try {
    activateAdminKeySession(storage);
  } finally {
    navigate("/admin");
  }
}
