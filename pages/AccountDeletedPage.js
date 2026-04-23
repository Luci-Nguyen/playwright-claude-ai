/**
 * pages/AccountDeletedPage.js
 * Page Object cho trang xác nhận xóa tài khoản thành công
 * URL: https://automationexercise.com/delete_account
 */

const BasePage = require('./BasePage');

class AccountDeletedPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    // ===== LOCATORS =====
    // Heading "ACCOUNT DELETED!" - xác nhận tài khoản đã bị xóa
    this.accountDeletedHeading = page.locator('[data-qa="account-deleted"]');

    // Nút "Continue" sau khi xóa tài khoản
    this.continueBtn = page.locator('[data-qa="continue-button"]');
  }

  /**
   * Kiểm tra heading "ACCOUNT DELETED!" có hiển thị không
   * @returns {Promise<boolean>}
   */
  async isAccountDeletedVisible() {
    await this.accountDeletedHeading.waitFor({ state: 'visible', timeout: 10000 });
    return await this.accountDeletedHeading.isVisible();
  }

  /**
   * Lấy text heading để assert chính xác
   * @returns {Promise<string>}
   */
  async getHeadingText() {
    return await this.accountDeletedHeading.textContent();
  }

  /**
   * Click nút "Continue"
   */
  async clickContinue() {
    await this.continueBtn.click();
  }
}

module.exports = AccountDeletedPage;