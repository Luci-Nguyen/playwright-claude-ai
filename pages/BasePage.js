
class BasePage {
  /**
   * @param {import('@playwright/test').Page} page - Playwright Page object
   */
  constructor(page) {
    this.page = page;
    this.baseURL = 'https://automationexercise.com';
  }

  /**
   * Điều hướng đến trang chủ
   */
  async goto() {
    await this.page.goto(this.baseURL);
  }

  /**
   * Lấy title của trang hiện tại
   * @returns {Promise<string>}
   */
  async getTitle() {
    return await this.page.title();
  }

  /**
   * Chờ cho element hiển thị và trả về locator
   * @param {string} selector
   * @returns {import('@playwright/test').Locator}
   */
  getLocator(selector) {
    return this.page.locator(selector);
  }

  /**
   * Scroll đến cuối trang
   */
  async scrollToBottom() {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  /**
   * Chờ một khoảng thời gian (dùng khi cần thiết, tránh lạm dụng)
   * @param {number} ms - Milliseconds
   */
  async waitMs(ms) {
    await this.page.waitForTimeout(ms);
  }
}

module.exports = BasePage;