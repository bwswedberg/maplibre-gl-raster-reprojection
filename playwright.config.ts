import type { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  use: {
    baseURL: "http://localhost:5173",
    viewport: { width: 512, height: 512 },
    screenshot: "only-on-failure"
  },
  testMatch: ["lib/**/*.e2e.ts"]
};

export default config;
