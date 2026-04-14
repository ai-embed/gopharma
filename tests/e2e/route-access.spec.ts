import { test, expect, type BrowserContext } from "@playwright/test";

const ROLE_COOKIE_KEY = "gopharma_role";

async function setRoleCookie(context: BrowserContext, role: string) {
  await context.addCookies([
    {
      name: ROLE_COOKIE_KEY,
      value: role,
      domain: "127.0.0.1",
      path: "/",
      sameSite: "Lax",
    },
  ]);
}

test.describe("Route Access", () => {
  test("redirects guest from patient routes to /login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login$/);
  });

  test("redirects guest from pharmacy routes to /pharmacy-login", async ({ page }) => {
    await page.goto("/pharmacy/dashboard");
    await expect(page).toHaveURL(/\/pharmacy-login$/);
  });

  test("blocks patient from admin routes", async ({ context, page }) => {
    await setRoleCookie(context, "PATIENT");
    await page.goto("/admin/dashboard");
    await expect(page).toHaveURL(/\/dashboard$/);
  });

  test("blocks pharmacy manager from patient routes", async ({ context, page }) => {
    await setRoleCookie(context, "PHARMACY_MANAGER");
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/pharmacy\/dashboard$/);
  });

  test("redirects admin away from auth pages", async ({ context, page }) => {
    await setRoleCookie(context, "ADMIN");
    await page.goto("/login");
    await expect(page).toHaveURL(/\/admin\/dashboard$/);
  });
});
