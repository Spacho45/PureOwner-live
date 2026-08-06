const DB_NAME = "pureowner-identity-companion";
const STORE_NAME = "companion";
const RECORD_KEY = "state";
const CONSENT_KEY = "pureowner-companion-consent";

const EMPTY_STATE = {
  profile: {},
  journal: [],
  favorites: [],
  confirmedFacets: [],
  facetDecisions: [],
  questionIndex: 0,
  updatedAt: null
};

let memoryState = structuredClone(EMPTY_STATE);

function hasIndexedDb() {
  return typeof indexedDB !== "undefined";
}

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function transact(mode, callback) {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, mode);
    const store = transaction.objectStore(STORE_NAME);
    const request = callback(store);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => database.close();
  });
}

export function hasConsent() {
  try {
    return localStorage.getItem(CONSENT_KEY) === "granted";
  } catch {
    return false;
  }
}

export async function setConsent(granted) {
  try {
    if (granted) localStorage.setItem(CONSENT_KEY, "granted");
    else localStorage.removeItem(CONSENT_KEY);
  } catch { /* session-only mode remains available */ }
  if (!granted && hasIndexedDb()) {
    await new Promise((resolve) => {
      const request = indexedDB.deleteDatabase(DB_NAME);
      request.onsuccess = request.onerror = request.onblocked = () => resolve();
    });
  }
  if (granted) await saveState(memoryState);
}

export async function loadState() {
  if (!hasConsent() || !hasIndexedDb()) return structuredClone(memoryState);
  try {
    const saved = await transact("readonly", (store) => store.get(RECORD_KEY));
    memoryState = { ...structuredClone(EMPTY_STATE), ...(saved || {}) };
  } catch { /* IndexedDB can be unavailable in private contexts */ }
  return structuredClone(memoryState);
}

export async function saveState(nextState) {
  memoryState = { ...structuredClone(EMPTY_STATE), ...structuredClone(nextState), updatedAt: new Date().toISOString() };
  if (!hasConsent() || !hasIndexedDb()) return;
  try {
    await transact("readwrite", (store) => store.put(memoryState, RECORD_KEY));
  } catch { /* keep session memory as fallback */ }
}

export async function clearState() {
  memoryState = structuredClone(EMPTY_STATE);
  if (hasIndexedDb()) {
    try { await transact("readwrite", (store) => store.delete(RECORD_KEY)); } catch { /* noop */ }
  }
  return structuredClone(memoryState);
}

export function emptyState() {
  return structuredClone(EMPTY_STATE);
}
