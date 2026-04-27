export type Coordinates = {
  lat: number;
  lng: number;
};

export type LocationMode = "once" | "always";

const PERSISTENT_CHOICE_KEY = "gp.location.choice";
const SESSION_CHOICE_DONE_KEY = "gp.location.choice.session.done";
const SESSION_CHOICE_CONTEXT_KEY = "gp.location.choice.session.context";
const LOCAL_COORDS_KEY = "gp.location.coords.local";
const SESSION_COORDS_KEY = "gp.location.coords.session";

function isBrowser() {
  return typeof window !== "undefined";
}

function isValidCoordinates(value: unknown): value is Coordinates {
  if (!value || typeof value !== "object") {
    return false;
  }

  const coords = value as Partial<Coordinates>;
  return Number.isFinite(coords.lat) && Number.isFinite(coords.lng);
}

function safeParseCoordinates(raw: string | null): Coordinates | null {
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    return isValidCoordinates(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function getPersistentLocationChoice(): "always" | null {
  if (!isBrowser()) {
    return null;
  }

  const value = window.localStorage.getItem(PERSISTENT_CHOICE_KEY);
  return value === "always" ? "always" : null;
}

export function setPersistentLocationChoice(mode: "always") {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(PERSISTENT_CHOICE_KEY, mode);
}

export function clearPersistentLocationChoice() {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(PERSISTENT_CHOICE_KEY);
}

export function hasSessionLocationChoice(sessionContext?: string) {
  if (!isBrowser()) {
    return false;
  }

  if (window.sessionStorage.getItem(SESSION_CHOICE_DONE_KEY) !== "1") {
    return false;
  }

  if (!sessionContext) {
    return true;
  }

  return (
    window.sessionStorage.getItem(SESSION_CHOICE_CONTEXT_KEY) === sessionContext
  );
}

export function markSessionLocationChoiceDone(sessionContext?: string) {
  if (!isBrowser()) {
    return;
  }

  window.sessionStorage.setItem(SESSION_CHOICE_DONE_KEY, "1");
  if (sessionContext) {
    window.sessionStorage.setItem(SESSION_CHOICE_CONTEXT_KEY, sessionContext);
    return;
  }
  window.sessionStorage.removeItem(SESSION_CHOICE_CONTEXT_KEY);
}

export function saveLocationCoords(coords: Coordinates, mode: LocationMode) {
  if (!isBrowser()) {
    return;
  }

  const serialized = JSON.stringify(coords);
  if (mode === "always") {
    window.localStorage.setItem(LOCAL_COORDS_KEY, serialized);
    window.sessionStorage.removeItem(SESSION_COORDS_KEY);
    return;
  }

  window.localStorage.removeItem(LOCAL_COORDS_KEY);
  window.sessionStorage.setItem(SESSION_COORDS_KEY, serialized);
}

export function getSavedLocationCoords(): Coordinates | null {
  if (!isBrowser()) {
    return null;
  }

  const sessionCoords = safeParseCoordinates(
    window.sessionStorage.getItem(SESSION_COORDS_KEY)
  );
  if (sessionCoords) {
    return sessionCoords;
  }

  if (getPersistentLocationChoice() !== "always") {
    return null;
  }

  return safeParseCoordinates(window.localStorage.getItem(LOCAL_COORDS_KEY));
}

export function requestCurrentPosition(
  options: PositionOptions = { timeout: 7000, enableHighAccuracy: false }
): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new Error("La géolocalisation n'est pas disponible."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          reject(new Error("L'accès à la localisation a été refusé."));
          return;
        }

        reject(new Error("Impossible de récupérer votre localisation."));
      },
      options
    );
  });
}

export function clearLocationAccessState(options?: {
  keepPersistentChoice?: boolean;
}) {
  if (!isBrowser()) {
    return;
  }

  window.sessionStorage.removeItem(SESSION_CHOICE_DONE_KEY);
  window.sessionStorage.removeItem(SESSION_CHOICE_CONTEXT_KEY);
  window.sessionStorage.removeItem(SESSION_COORDS_KEY);

  if (options?.keepPersistentChoice) {
    if (getPersistentLocationChoice() !== "always") {
      window.localStorage.removeItem(LOCAL_COORDS_KEY);
    }
    return;
  }

  window.localStorage.removeItem(PERSISTENT_CHOICE_KEY);
  window.localStorage.removeItem(LOCAL_COORDS_KEY);
}
