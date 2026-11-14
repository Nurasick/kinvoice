/**
 * Browser storage for the caregiver's edit key. Owner: Yernur.
 * localStorage can throw (private mode, blocked storage) — always fail soft.
 */
const STORAGE_KEY = "kinvoice.editKey";

export function loadWorkspaceKey(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function saveWorkspaceKey(key: string): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, key);
  } catch {
    // Storage unavailable: the caregiver can still use the bookmarked edit link.
  }
}

export function clearWorkspaceKey(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

/** The private link the caregiver bookmarks to get back in from any device. */
export function editLink(origin: string, key: string): string {
  return `${origin}/w/${encodeURIComponent(key)}`;
}
