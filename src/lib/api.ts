import { getAccessToken } from "./auth";

export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

type ApiResult<T> = {
  ok: boolean;
  status: number;
  data?: T;
  error?: string;
};

function isFormDataBody(body: unknown): body is FormData {
  return typeof FormData !== "undefined" && body instanceof FormData;
}

export async function apiJson<T>(
  path: string,
  init?: RequestInit
): Promise<ApiResult<T>> {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  try {
    const isMultipart = isFormDataBody(init?.body);
    const headers = new Headers(init?.headers ?? {});
    if (isMultipart) {
      // Important: let the browser set multipart/form-data boundary automatically.
      headers.delete("Content-Type");
      headers.delete("content-type");
    } else if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    const response = await fetch(url, {
      ...init,
      headers,
    });
    const text = await response.text();
    const contentType = response.headers.get("content-type") ?? "";
    const isJson = contentType.includes("application/json");

    let data: T | undefined;
    if (text && isJson) {
      try {
        data = JSON.parse(text) as T;
      } catch {
        data = undefined;
      }
    }

    if (!response.ok) {
      const detailFromJson =
        data && typeof data === "object"
          ? (data as { detail?: string; message?: string }).detail ??
            (data as { detail?: string; message?: string }).message
          : undefined;
      const detailFromText = !isJson && text ? text : undefined;
      
      // Log errors for debugging (in development)
      if (process.env.NODE_ENV === "development") {
        console.error(`[API Error] ${path}`, {
          status: response.status,
          statusText: response.statusText,
          error: detailFromJson ?? detailFromText,
        });
      }

      return {
        ok: false,
        status: response.status,
        error:
          detailFromJson ??
          detailFromText ??
          response.statusText ??
          `HTTP ${response.status}`,
        data,
      };
    }

    return { ok: true, status: response.status, data };
  } catch (error) {
    // Log network errors for debugging (in development)
    if (process.env.NODE_ENV === "development") {
      console.error(`[Network Error] ${path}`, error);
    }

    return {
      ok: false,
      status: 0,
      error: error instanceof Error ? error.message : "Network error",
    };
  }
}

export async function apiJsonAuth<T>(
  path: string,
  init?: RequestInit
): Promise<ApiResult<T>> {
  const token = getAccessToken();
  return apiJson<T>(path, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}
