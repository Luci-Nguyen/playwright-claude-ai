/**
 * pages/AccountCreatedPage.js
 * Page Object cho trang xác nhận tạo tài khoản thành công
 * URL: https://automationexercise.com/account_created
 */

const BasePage = require('./BasePage');

class AccountCreatedPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    // ===== LOCATORS =====
    // Heading "ACCOUNT CREATED!" - màu xanh lá
    // Selector dùng data-qa attribute (ổn định hơn class hay text)
    this.accountCreatedHeading = page.locator('[data-qa="account-created"]');

    // Nút "Continue" sau khi tạo tài khoản thành công
    this.continueBtn = page.locator('[data-qa="continue-button"]');
  }

  /**
   * Kiểm tra heading "ACCOUNT CREATED!" có hiển thị không
   * @returns {Promise<boolean>}
   */
  async isAccountCreatedVisible() {
    await this.accountCreatedHeading.waitFor({ state: 'visible', timeout: 10000 });
    return await this.accountCreatedHeading.isVisible();
  }

  /**
   * Lấy text heading để assert chính xác
   * @returns {Promise<string>}
   */
  async getHeadingText() {
    return await this.accountCreatedHeading.textContent();
  }

  /**
   * Click nút "Continue" để về trang chủ với trạng thái đã đăng nhập
   */
  async clickContinue() {
    await this.continueBtn.click();
  }
}

module.exports = AccountCreatedPage;