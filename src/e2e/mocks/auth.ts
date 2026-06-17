import type { Page } from '@playwright/test';

interface User {
  readonly id: string;
  readonly email: string;
  readonly roles: readonly string[];
}

const DEFAULT_USER: User = { id: '1', email: 'test@example.com', roles: [] };

/**
 * Create a JWT-shaped token the frontend's AuthProvider will accept.
 * The token is base64Url(header).base64Url(payload).fake-signature.
 * Frontend only reads `roles` and `exp` from the payload — no signature check.
 */
export function createToken(user: User = DEFAULT_USER): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      roles: user.roles,
      exp: Math.floor(Date.now() / 1000) + 3600,
    }),
  );
  return `${header}.${payload}.fake-signature`;
}

/**
 * Mock user resource for RegisterResponse compatibility.
 * Returns the shape: { id, type, attributes: { email, roles, createdAt } }
 * This matches the UserResource type in api/types.ts.
 */
export function makeUserResource(user: User = DEFAULT_USER) {
  return {
    id: user.id,
    type: 'user' as const,
    attributes: {
      email: user.email,
      roles: [...user.roles] as readonly string[],
      createdAt: new Date().toISOString(),
    },
  };
}

/**
 * Mock response for GET /api/me (flat shape, no `attributes` wrapper).
 * AuthProvider reads `data.email` and `data.roles` directly.
 */
export function makeMeResponse(user: User = DEFAULT_USER) {
  return {
    data: {
      id: user.id,
      type: 'user' as const,
      email: user.email,
      roles: [...user.roles] as readonly string[],
      createdAt: new Date().toISOString(),
    },
  };
}

/**
 * Mock POST /api/register.
 * By default returns 201 with the user resource.
 * Pass `failWith: { status, detail }` to simulate API errors (duplicate email, etc.).
 * Note: RegisterPage reads `errors[].detail` for keyword matching.
 */
export async function mockRegister(page: Page, options?: { failWith?: { status: number; detail: string } }) {
  await page.route('**/api/register', async (route, request) => {
    if (request.method() !== 'POST') {
      await route.continue();
      return;
    }
    if (options?.failWith) {
      await route.fulfill({
        status: options.failWith.status,
        contentType: 'application/json',
        body: JSON.stringify({
          errors: [{ status: String(options.failWith.status), detail: options.failWith.detail }],
        }),
      });
      return;
    }
    const body = JSON.parse(request.postData() || '{}');
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({ data: makeUserResource({ ...DEFAULT_USER, email: body.email }) }),
    });
  });
}

/**
 * Mock POST /api/login.
 * By default returns 200 with a valid JWT token.
 * Pass `failWith` to simulate invalid credentials or unverified email.
 * Response uses `{ message: "..." }` shape — LoginPage reads `error.response?.data?.message`.
 */
export async function mockLogin(page: Page, options?: { failWith?: { status: number; message: string } }) {
  await page.route('**/api/login', async (route, request) => {
    if (request.method() !== 'POST') {
      await route.continue();
      return;
    }
    if (options?.failWith) {
      await route.fulfill({
        status: options.failWith.status,
        contentType: 'application/json',
        body: JSON.stringify({ message: options.failWith.message }),
      });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ token: createToken() }),
    });
  });
}

/**
 * Mock GET /api/me.
 * Returns the current user. AuthProvider calls this on mount to validate the stored token.
 * If not mocked, it returns 401 and logs the user out.
 * Uses flat shape: { data: { id, type, email, roles, createdAt } }
 */
export async function mockMe(page: Page, options?: { failWith401?: boolean }) {
  await page.route('**/api/me', async (route) => {
    if (options?.failWith401) {
      await route.fulfill({ status: 401 });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(makeMeResponse()),
    });
  });
}
