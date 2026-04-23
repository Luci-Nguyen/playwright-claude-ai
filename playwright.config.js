// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Playwright Configuration
 * Tài liệu: https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  // Thư mục chứa các file test
  testDir: './tests',

  // Chạy test song song
  fullyParallel: false,

  // Fail build nếu để test.only trong source code (CI)
  forbidOnly: !!process.env.CI,

  // Số lần retry khi test fail
  retries: process.env.CI ? 2 : 0,

  // Số worker chạy song song
  workers: 1,

  // Reporter: html tạo report đẹp, line hiển thị trên terminal
  reporter: [['html', { outputFolder: 'playwright-report' }], ['line']],

  use: {
    // Base URL để dùng với page.goto('/')
    baseURL: 'https://automationexercise.com',

    // Chụp screenshot khi test fail
    screenshot: 'only-on-failure',

    // Ghi video khi test fail
    video: 'retain-on-failure',

    // Ghi trace khi test fail (dùng để debug)
    trace: 'on-first-retry',

    // Timeout cho mỗi action (mặc định 30s)
    actionTimeout: 15000,

    // Timeout cho navigation
    navigationTimeout: 30000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Timeout cho toàn bộ 1 test
  timeout: 60000,
});