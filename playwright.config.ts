import { defineConfig } from "@playwright/test"

export default defineConfig({
  testDir: "./tests",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000",
    trace: "retain-on-failure"
  },
  webServer: {
    command: "npm run dev -- --port 3000", [modified]
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI
  }
})
