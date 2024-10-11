import type { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  webServer: {
    command: "npm run preview",
    url: "http://127.0.0.1:5173",
    timeout: 10 * 1000,
    reuseExistingServer: !process.env.CI
  },
  use: {
    baseURL: "http://127.0.0.1:5173",
    viewport: { width: 512, height: 512 },
    screenshot: "only-on-failure"
  },
  testMatch: ["lib/**/*.e2e.ts"]
};

export default config;
