/**
 * pages/LoginPage.js
 * Page Object cho trang Signup / Login
 * URL: https://automationexercise.com/login
 */

const BasePage = require('./BasePage');

class LoginPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    // ===== LOCATORS - SECTION LOGIN (bên trái) =====
    // Heading "Login to your account"
    this.loginHeading = page.locator('.login-form h2');

    // Input email trong form Login - dùng name attribute để phân biệt với form Signup
    this.loginEmailInput = page.locator('[data-qa="login-email"]');

    // Input password trong form Login
    this.loginPasswordInput = page.locator('[data-qa="login-password"]');

    // Nút "Login"
    this.loginBtn = page.locator('[data-qa="login-button"]');

    // Thông báo lỗi khi login sai credentials
    // Nằm trong thẻ <p> bên trong form login
    this.loginErrorMsg = page.locator('.login-form p');

    // ===== LOCATORS - SECTION SIGNUP (bên phải) =====
    // Heading "New User Signup!"
    this.signupHeading = page.locator('.signup-form h2');

    // Input tên trong form Signup
    this.signupNameInput = page.locator('[data-qa="signup-name"]');

    // Input email trong form Signup
    this.signupEmailInput = page.locator('[data-qa="signup-email"]');

    // Nút "Signup"
    this.signupBtn = page.locator('[data-qa="signup-button"]');

    // Thông báo lỗi khi email đã tồn tại
    this.signupErrorMsg = page.locator('.signup-form p');
  }

  /**
   * Nhập thông tin và thực hiện đăng nhập
   * @param {string} email
   * @param {string} password
   */
  async login(email, password) {
    await this.loginEmailInput.fill(email);
    await this.loginPasswordInput.fill(password);
    await this.loginBtn.click();
  }

  /**
   * Nhập tên và email để bắt đầu quá trình đăng ký
   * @param {string} name
   * @param {string} email
   */
  async fillSignupForm(name, email) {
    await this.signupNameInput.fill(name);
    await this.signupEmailInput.fill(email);
    await this.signupBtn.click();
  }

  /**
   * Lấy text của thông báo lỗi login
   * @returns {Promise<string>}
   */
  async getLoginErrorMessage() {
    return await this.loginErrorMsg.textContent();
  }

  /**
   * Kiểm tra heading "Login to your account" có hiển thị không
   * @returns {Promise<boolean>}
   */
  async isLoginHeadingVisible() {
    return await this.loginHeading.isVisible();
  }

  /**
   * Kiểm tra heading "New User Signup!" có hiển thị không
   * @returns {Promise<boolean>}
   */
  async isSignupHeadingVisible() {
    return await this.signupHeading.isVisible();
  }

  /**
   * Lấy URL hiện tại để verify đang ở trang login
   * @returns {Promise<string>}
   */
  async getCurrentURL() {
    return this.page.url();
  }
}

module.exports = LoginPage;