import { getAccessToken } from "./auth";

export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

type ApiResult<T> = {
  ok: boolean;
  status: number;
  data?: T;
  error?: string;
};

export async function apiJson<T>(
  path: string,
  init?: RequestInit
): Promise<ApiResult<T>> {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  try {
    const response = await fetch(url, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
    });
    const text = await response.text();
    const data = text ? (JSON.parse(text) as T) : undefined;

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        error: (data as { detail?: string })?.detail ?? response.statusText,
        data,
      };
    }

    return { ok: true, status: response.status, data };
  } catch (error) {
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
