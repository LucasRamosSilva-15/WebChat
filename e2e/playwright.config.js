// Testes ponta a ponta (E2E) com Playwright.
// Sobe sozinho: backend de teste (SQLite em memória, porta 3101) e frontend (Vite, porta 5273).
const { defineConfig, devices } = require('@playwright/test');
const path = require('path');

const root = path.resolve(__dirname, '..');
const BACKEND_PORT = 3101;
const FRONTEND_PORT = 5273;

module.exports = defineConfig({
  testDir: path.join(__dirname, 'tests'),
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1, // o banco de teste é único e em memória
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never', outputFolder: path.join(__dirname, 'report') }]],
  outputDir: path.join(__dirname, 'results'),
  use: {
    baseURL: `http://localhost:${FRONTEND_PORT}`,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
    permissions: ['microphone'],
    launchOptions: {
      // Microfone falso: permite testar a gravação de áudio sem hardware
      args: ['--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream']
    }
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: 'node backend/e2e/server.js',
      cwd: root,
      url: `http://localhost:${BACKEND_PORT}/`,
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
      env: { E2E_BACKEND_PORT: String(BACKEND_PORT) }
    },
    {
      command: `npm run dev -- --port ${FRONTEND_PORT} --strictPort --host localhost`,
      cwd: path.join(root, 'frontend'),
      url: `http://localhost:${FRONTEND_PORT}/`,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: { VITE_BACKEND_URL: `http://localhost:${BACKEND_PORT}` }
    }
  ]
});
