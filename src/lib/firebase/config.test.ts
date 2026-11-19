import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { apiJsonAuth } from "@/lib/api";
import { hasFirebaseMessagingConfig, registerToken } from "./config";

vi.mock("@/lib/api", () => ({
  apiJsonAuth: vi.fn(),
}));

describe("registerToken", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  beforeEach(() => {
    vi.mocked(apiJsonAuth).mockReset();
  });

  it("registers the token through the authenticated API endpoint", async () => {
    vi.mocked(apiJsonAuth).mockResolvedValue({
      ok: true,
      status: 201,
      data: { success: true },
    });

    await expect(registerToken("test-fcm-token")).resolves.toBe(true);

    expect(apiJsonAuth).toHaveBeenCalledWith(
      "/api/notifications/push-tokens",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ token: "test-fcm-token", platform: "web" }),
      })
    );
  });

  it("reports failed token registration", async () => {
    vi.mocked(apiJsonAuth).mockResolvedValue({
      ok: false,
      status: 401,
      error: "Unauthorized",
    });

    await expect(registerToken("test-fcm-token")).resolves.toBe(false);
  });

  it("requires Firebase client settings and a VAPID key", () => {
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_API_KEY", "public-key");
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", "example.firebaseapp.com");
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID", "example");
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET", "example.appspot.com");
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID", "123");
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_APP_ID", "1:123:web:abc");
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_VAPID_KEY", "");

    expect(hasFirebaseMessagingConfig()).toBe(false);
  });
});
