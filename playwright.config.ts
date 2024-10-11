import type { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  webServer: [
    {
      command: "npm run e2e:serve",
      url: "http://127.0.0.1:3000",
      timeout: 10 * 1000,
      reuseExistingServer: !process.env.CI
    }
  ],
  use: {
    baseURL: "http://127.0.0.1:3000",
    viewport: { width: 512, height: 512 },
    screenshot: "only-on-failure"
  },
  testMatch: ["lib/**/*.e2e.ts"]
};

export default config;
