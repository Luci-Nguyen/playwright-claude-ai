
const BasePage = require('./BasePage');

class SignupPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    // ===== LOCATORS - TIÊU ĐỀ =====
    // Heading "ENTER ACCOUNT INFORMATION"
    // Nằm trong thẻ h2 với class đặc trưng
    this.accountInfoHeading = page.getByRole('heading', { name: 'Enter Account Information' });

    // ===== LOCATORS - THÔNG TIN TÀI KHOẢN =====
    // Radio button "Mr" - title/giới tính
    this.titleMr = page.locator('#id_gender1');

    // Radio button "Mrs"
    this.titleMrs = page.locator('#id_gender2');

    // Input tên (đã được điền sẵn từ bước trước)
    this.nameInput = page.locator('[data-qa="name"]');

    // Input email (đã được điền sẵn và disabled)
    this.emailInput = page.locator('[data-qa="email"]');

    // Input password
    this.passwordInput = page.locator('[data-qa="password"]');

    // Dropdown ngày sinh - Day
    this.dobDaySelect = page.locator('[data-qa="days"]');

    // Dropdown ngày sinh - Month
    this.dobMonthSelect = page.locator('[data-qa="months"]');

    // Dropdown ngày sinh - Year
    this.dobYearSelect = page.locator('[data-qa="years"]');

    // ===== LOCATORS - CHECKBOXES =====
    // Checkbox "Sign up for our newsletter!"
    this.newsletterCheckbox = page.locator('#newsletter');

    // Checkbox "Receive special offers from our partners!"
    this.offersCheckbox = page.locator('#optin');

    // ===== LOCATORS - THÔNG TIN ĐỊA CHỈ =====
    // Input First Name
    this.firstNameInput = page.locator('[data-qa="first_name"]');

    // Input Last Name
    this.lastNameInput = page.locator('[data-qa="last_name"]');

    // Input Company (không bắt buộc)
    this.companyInput = page.locator('[data-qa="company"]');

    // Input Address line 1
    this.address1Input = page.locator('[data-qa="address"]');

    // Input Address line 2
    this.address2Input = page.locator('[data-qa="address2"]');

    // Dropdown Country
    this.countrySelect = page.locator('[data-qa="country"]');

    // Input State
    this.stateInput = page.locator('[data-qa="state"]');

    // Input City
    this.cityInput = page.locator('[data-qa="city"]');

    // Input Zipcode
    this.zipcodeInput = page.locator('[data-qa="zipcode"]');

    // Input Mobile Number
    this.mobileInput = page.locator('[data-qa="mobile_number"]');

    // ===== LOCATORS - NÚT =====
    // Nút "Create Account"
    this.createAccountBtn = page.locator('[data-qa="create-account"]');
  }

  /**
   * Điền đầy đủ thông tin tài khoản và submit
   * @param {Object} userData - Dữ liệu user từ test-data/users.js
   */
  async fillAccountDetails(userData) {
    // Chọn title (Mr/Mrs)
    if (userData.title === 'Mr') {
      await this.titleMr.check();
    } else {
      await this.titleMrs.check();
    }

    // Điền password
    await this.passwordInput.fill(userData.password);

    // Chọn ngày sinh
    await this.dobDaySelect.selectOption(userData.dateOfBirth.day);
    await this.dobMonthSelect.selectOption(userData.dateOfBirth.month);
    await this.dobYearSelect.selectOption(userData.dateOfBirth.year);
  }

  /**
   * Tick checkbox Newsletter và Offers
   */
  async selectNewsletterAndOffers() {
    await this.newsletterCheckbox.check();
    await this.offersCheckbox.check();
  }

  /**
   * Điền thông tin địa chỉ
   * @param {Object} userData - Dữ liệu user từ test-data/users.js
   */
  async fillAddressDetails(userData) {
    await this.firstNameInput.fill(userData.firstName);
    await this.lastNameInput.fill(userData.lastName);
    await this.companyInput.fill(userData.company);
    await this.address1Input.fill(userData.address1);
    await this.address2Input.fill(userData.address2);
    await this.countrySelect.selectOption(userData.country);
    await this.stateInput.fill(userData.state);
    await this.cityInput.fill(userData.city);
    await this.zipcodeInput.fill(userData.zipcode);
    await this.mobileInput.fill(userData.mobileNumber);
  }

  /**
   * Click nút "Create Account"
   */
  async clickCreateAccount() {
    await this.createAccountBtn.click();
  }

  /**
   * Kiểm tra heading "ENTER ACCOUNT INFORMATION" có hiển thị không
   * @returns {Promise<boolean>}
   */
  async isAccountInfoHeadingVisible() {
    return await this.accountInfoHeading.isVisible();
  }

  /**
   * Lấy text của heading để assert
   * @returns {Promise<string>}
   */
  async getAccountInfoHeadingText() {
    return await this.accountInfoHeading.textContent();
  }
}

module.exports = SignupPage;