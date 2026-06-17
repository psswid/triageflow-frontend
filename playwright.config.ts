import { defineConfig, devices } from '@playwright/test';

const isE2EMock = process.env.E2E_MOCK_BACKEND === 'true';

export default defineConfig({
  testDir: './src/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: 'npm run dev',
      url: 'http://localhost:5173',
      reuseExistingServer: !process.env.CI,
    },
    // Skip Docker backend in mock mode — all API calls are intercepted via page.route()
    ...(isE2EMock
      ? []
      : [
          {
            command: 'docker compose -f ../backend/docker-compose.yml up -d',
            url: 'http://localhost:8000/health',
            reuseExistingServer: !process.env.CI,
          },
        ]),
  ],
});
