/**
 * pages/HomePage.js
 * Page Object cho trang chủ automationexercise.com
 * Chứa tất cả locators và actions liên quan đến trang chủ
 */

const BasePage = require('./BasePage');

class HomePage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    // ===== LOCATORS - NAVBAR =====
    // Logo trang chủ - dùng để verify trang chủ đã load
    this.logo = page.locator('#header .logo img');

    // Nút "Signup / Login" trên thanh điều hướng
    // Selector dựa vào text vì không có id/class đặc trưng
    this.signupLoginBtn = page.locator('a[href="/login"]');

    // Nút "Delete Account" trên navbar (chỉ hiển thị sau khi login)
    this.deleteAccountBtn = page.locator('a[href="/delete_account"]');

    // Nút "Logout" trên navbar (chỉ hiển thị sau khi login)
    this.logoutBtn = page.locator('a[href="/logout"]');

    // Text hiển thị tên user đã đăng nhập: "Logged in as <username>"
    // Selector dựa vào cấu trúc DOM của navbar
    this.loggedInAsText = page.locator('li a:has(b)');

    // ===== LOCATORS - HOME PAGE CONTENT =====
    // Slider/banner đầu trang - dùng để xác nhận trang chủ đã load thành công
    this.homeSlider = page.locator('#slider');

    // Text hero section trên trang chủ
    this.heroText = page.locator('.item.active h2');
  }

  /**
   * Điều hướng đến trang chủ
   */
  async navigate() {
    await this.page.goto(this.baseURL);
  }

  /**
   * Kiểm tra trang chủ hiển thị thành công
   * Dựa vào việc slider/logo đang hiển thị
   * @returns {Promise<boolean>}
   */
  async isHomePageVisible() {
    // Chờ slider xuất hiện - đây là dấu hiệu trang đã load xong
    await this.homeSlider.waitFor({ state: 'visible', timeout: 10000 });
    return await this.homeSlider.isVisible();
  }

  /**
   * Click vào nút "Signup / Login"
   */
  async clickSignupLogin() {
    await this.signupLoginBtn.click();
  }

  /**
   * Click vào nút "Delete Account"
   */
  async clickDeleteAccount() {
    await this.deleteAccountBtn.click();
  }

  /**
   * Click vào nút "Logout"
   */
  async clickLogout() {
    await this.logoutBtn.click();
  }

  /**
   * Lấy text "Logged in as username"
   * @returns {Promise<string>}
   */
  async getLoggedInText() {
    return await this.loggedInAsText.textContent();
  }

  /**
   * Kiểm tra user đã đăng nhập chưa (dựa vào text "Logged in as")
   * @returns {Promise<boolean>}
   */
  async isLoggedIn() {
    return await this.loggedInAsText.isVisible();
  }

  /**
   * Kiểm tra nút Logout có hiển thị không
   * @returns {Promise<boolean>}
   */
  async isLogoutVisible() {
    return await this.logoutBtn.isVisible();
  }
}

module.exports = HomePage;