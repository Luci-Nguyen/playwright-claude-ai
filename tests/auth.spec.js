/**
 * tests/auth.spec.js
 * ==========================================
 * Test Suite: Authentication - TC1 đến TC4
 * Website: https://automationexercise.com
 *
 * Bao gồm:
 *   TC1 - Register User (Đăng ký tài khoản mới)
 *   TC2 - Login User with correct email and password (Đăng nhập đúng)
 *   TC3 - Login User with incorrect email and password (Đăng nhập sai)
 *   TC4 - Logout User (Đăng xuất)
 *
 * Mô hình: Page Object Model (POM)
 * Framework: Playwright
 * ==========================================
 */

const { test, expect } = require('@playwright/test');

// Import Page Objects
const HomePage = require('../pages/HomePage');
const LoginPage = require('../pages/LoginPage');
const SignupPage = require('../pages/SignupPage');
const AccountCreatedPage = require('../pages/AccountCreatedPage');
const AccountDeletedPage = require('../pages/AccountDeletedPage');

// Import Test Data
const { generateUniqueUser, EXISTING_USER, INVALID_USER } = require('../test-data/users');

// ============================================================
// TEST CASE 1: Register User
// Mục tiêu: Đăng ký tài khoản mới thành công rồi xóa tài khoản
// ============================================================
test('TC1 - Register User', async ({ page }) => {
  // Khởi tạo Page Objects
  const homePage = new HomePage(page);
  const loginPage = new LoginPage(page);
  const signupPage = new SignupPage(page);
  const accountCreatedPage = new AccountCreatedPage(page);
  const accountDeletedPage = new AccountDeletedPage(page);

  // Tạo dữ liệu user ngẫu nhiên để tránh trùng email
  const userData = generateUniqueUser();

  // ----------------------------------------------------------
  // STEP 1-3: Mở trang chủ và xác nhận hiển thị thành công
  // ----------------------------------------------------------
  await homePage.navigate();

  // ASSERTION: Trang chủ phải hiển thị (slider có mặt)
  const isHomeVisible = await homePage.isHomePageVisible();
  expect(isHomeVisible, 'Trang chủ phải hiển thị thành công').toBe(true);

  // ----------------------------------------------------------
  // STEP 4: Click nút "Signup / Login"
  // ----------------------------------------------------------
  await homePage.clickSignupLogin();

  // ASSERTION: URL phải chuyển đến /login
  await expect(page).toHaveURL(/.*login/);

  // ----------------------------------------------------------
  // STEP 5: Kiểm tra "New User Signup!" có hiển thị
  // ----------------------------------------------------------
  // ASSERTION: Heading "New User Signup!" phải visible
  await expect(
    page.locator('.signup-form h2'),
    '"New User Signup!" phải hiển thị'
  ).toBeVisible();

  const isSignupHeadingVisible = await loginPage.isSignupHeadingVisible();
  expect(isSignupHeadingVisible, '"New User Signup!" phải hiển thị').toBe(true);

  // ----------------------------------------------------------
  // STEP 6-7: Điền tên + email rồi click Signup
  // ----------------------------------------------------------
  await loginPage.fillSignupForm(userData.name, userData.email);

  // Chờ trang signup load
  await page.waitForURL(/.*signup/);

  // ----------------------------------------------------------
  // STEP 8: Kiểm tra "ENTER ACCOUNT INFORMATION" hiển thị
  // ----------------------------------------------------------
  // ASSERTION: Heading phải chứa text "Enter Account Information"
await expect(
    page.getByRole('heading', { name: 'Enter Account Information' })
).toBeVisible();

  const headingText = await signupPage.getAccountInfoHeadingText();
  expect(
    headingText.trim().toUpperCase(),
    'Heading phải là "ENTER ACCOUNT INFORMATION"'
  ).toContain('ENTER ACCOUNT INFORMATION');

  // ----------------------------------------------------------
  // STEP 9: Điền Title, Password, Date of Birth
  // ----------------------------------------------------------
  await signupPage.fillAccountDetails(userData);

  // ----------------------------------------------------------
  // STEP 10-11: Tick checkbox Newsletter và Special Offers
  // ----------------------------------------------------------
  await signupPage.selectNewsletterAndOffers();

  // ASSERTION: Cả hai checkbox phải được check
  await expect(page.locator('#newsletter'), 'Newsletter checkbox phải được check').toBeChecked();
  await expect(page.locator('#optin'), 'Offers checkbox phải được check').toBeChecked();

  // ----------------------------------------------------------
  // STEP 12: Điền thông tin địa chỉ
  // ----------------------------------------------------------
  await signupPage.fillAddressDetails(userData);

  // ----------------------------------------------------------
  // STEP 13: Click "Create Account"
  // ----------------------------------------------------------
  await signupPage.clickCreateAccount();

  // ----------------------------------------------------------
  // STEP 14: Kiểm tra "ACCOUNT CREATED!" hiển thị
  // ----------------------------------------------------------
  // ASSERTION: Trang xác nhận tạo tài khoản phải hiển thị
  const isAccountCreated = await accountCreatedPage.isAccountCreatedVisible();
  expect(isAccountCreated, '"ACCOUNT CREATED!" phải hiển thị').toBe(true);

  await expect(
    page.locator('[data-qa="account-created"]'),
    'Text "Account Created" phải hiển thị'
  ).toBeVisible();

  // ----------------------------------------------------------
  // STEP 15: Click "Continue"
  // ----------------------------------------------------------
  await accountCreatedPage.clickContinue();

  // ----------------------------------------------------------
  // STEP 16: Kiểm tra "Logged in as <username>" hiển thị
  // ----------------------------------------------------------
  // ASSERTION: User phải được đăng nhập tự động sau khi tạo tài khoản
  await expect(
    page.locator('li a:has(b)'),
    '"Logged in as username" phải hiển thị trên navbar'
  ).toBeVisible();

  const loggedInText = await homePage.getLoggedInText();
  expect(
    loggedInText,
    `Phải hiển thị "Logged in as ${userData.name}"`
  ).toContain(userData.name);

  // ----------------------------------------------------------
  // STEP 17: Click "Delete Account"
  // ----------------------------------------------------------
  await homePage.clickDeleteAccount();

  // ----------------------------------------------------------
  // STEP 18: Kiểm tra "ACCOUNT DELETED!" hiển thị rồi click Continue
  // ----------------------------------------------------------
  // ASSERTION: Trang xác nhận xóa tài khoản phải hiển thị
  const isAccountDeleted = await accountDeletedPage.isAccountDeletedVisible();
  expect(isAccountDeleted, '"ACCOUNT DELETED!" phải hiển thị').toBe(true);

  await expect(
    page.locator('[data-qa="account-deleted"]'),
    'Text "Account Deleted" phải hiển thị'
  ).toBeVisible();

  await accountDeletedPage.clickContinue();
});

// ============================================================
// TEST CASE 2: Login User with correct email and password
// Mục tiêu: Đăng nhập thành công với email/password đúng
// Lưu ý: TC này cần tài khoản đã tồn tại (EXISTING_USER)
//        Nếu chạy lần đầu, cần tạo tài khoản trước hoặc
//        setup bằng API trước khi chạy test
// ============================================================
test('TC2 - Login User with correct email and password', async ({ page }) => {
  const homePage = new HomePage(page);
  const loginPage = new LoginPage(page);
  const accountDeletedPage = new AccountDeletedPage(page);

  // ----------------------------------------------------------
  // STEP 1-3: Mở trang chủ và xác nhận hiển thị
  // ----------------------------------------------------------
  await homePage.navigate();

  // ASSERTION: Trang chủ phải load thành công
  const isHomeVisible = await homePage.isHomePageVisible();
  expect(isHomeVisible, 'Trang chủ phải hiển thị thành công').toBe(true);

  // ----------------------------------------------------------
  // STEP 4: Click nút "Signup / Login"
  // ----------------------------------------------------------
  await homePage.clickSignupLogin();

  // ----------------------------------------------------------
  // STEP 5: Kiểm tra "Login to your account" hiển thị
  // ----------------------------------------------------------
  // ASSERTION: Heading "Login to your account" phải visible
  const isLoginHeadingVisible = await loginPage.isLoginHeadingVisible();
  expect(isLoginHeadingVisible, '"Login to your account" phải hiển thị').toBe(true);

  await expect(
    page.locator('.login-form h2'),
    '"Login to your account" phải hiển thị'
  ).toBeVisible();

  // ----------------------------------------------------------
  // STEP 6-7: Nhập email/password đúng và click Login
  // ----------------------------------------------------------
  // Dùng tài khoản đã tạo sẵn (EXISTING_USER)
  await loginPage.login(EXISTING_USER.email, EXISTING_USER.password);

  // ----------------------------------------------------------
  // STEP 8: Kiểm tra "Logged in as username" hiển thị
  // ----------------------------------------------------------
  // ASSERTION: Sau khi login thành công, phải thấy tên user trên navbar
  await expect(
    page.locator('li a:has(b)'),
    '"Logged in as username" phải hiển thị sau khi login'
  ).toBeVisible({ timeout: 10000 });

  const loggedInText = await homePage.getLoggedInText();
  expect(
    loggedInText,
    `Phải hiển thị "Logged in as ${EXISTING_USER.name}"`
  ).toContain(EXISTING_USER.name);

  // ----------------------------------------------------------
  // STEP 9: Click "Delete Account" để dọn dẹp sau test
  // ----------------------------------------------------------
  await homePage.clickDeleteAccount();

  // ----------------------------------------------------------
  // STEP 10: Kiểm tra "ACCOUNT DELETED!" hiển thị
  // ----------------------------------------------------------
  // ASSERTION: Tài khoản phải bị xóa thành công
  const isAccountDeleted = await accountDeletedPage.isAccountDeletedVisible();
  expect(isAccountDeleted, '"ACCOUNT DELETED!" phải hiển thị').toBe(true);
});

// ============================================================
// TEST CASE 3: Login User with incorrect email and password
// Mục tiêu: Hệ thống phải hiển thị lỗi khi đăng nhập sai
// ============================================================
test('TC3 - Login User with incorrect email and password', async ({ page }) => {
  const homePage = new HomePage(page);
  const loginPage = new LoginPage(page);

  // ----------------------------------------------------------
  // STEP 1-3: Mở trang chủ và xác nhận hiển thị
  // ----------------------------------------------------------
  await homePage.navigate();

  // ASSERTION: Trang chủ phải load thành công
  const isHomeVisible = await homePage.isHomePageVisible();
  expect(isHomeVisible, 'Trang chủ phải hiển thị thành công').toBe(true);

  // ----------------------------------------------------------
  // STEP 4: Click nút "Signup / Login"
  // ----------------------------------------------------------
  await homePage.clickSignupLogin();

  // ----------------------------------------------------------
  // STEP 5: Kiểm tra "Login to your account" hiển thị
  // ----------------------------------------------------------
  // ASSERTION: Heading phải visible
  const isLoginHeadingVisible = await loginPage.isLoginHeadingVisible();
  expect(isLoginHeadingVisible, '"Login to your account" phải hiển thị').toBe(true);

  // ----------------------------------------------------------
  // STEP 6-7: Nhập email/password SAI và click Login
  // ----------------------------------------------------------
  await loginPage.login(INVALID_USER.email, INVALID_USER.password);

  // ----------------------------------------------------------
  // STEP 8: Kiểm tra thông báo lỗi hiển thị
  // ----------------------------------------------------------
  // ASSERTION: Thông báo "Your email or password is incorrect!" phải hiển thị
  const errorMsg = page.locator('p:has-text("Your email or password is incorrect!")');

  await expect(
    errorMsg,
    'Thông báo lỗi "Your email or password is incorrect!" phải hiển thị'
  ).toBeVisible();

  const errorText = await loginPage.getLoginErrorMessage();
  expect(
    errorText,
    'Nội dung lỗi phải đúng'
  ).toContain('Your email or password is incorrect!');

  // ASSERTION THÊM: Đảm bảo user KHÔNG bị đăng nhập
  const isLoggedIn = await homePage.isLoggedIn();
  expect(isLoggedIn, 'User không được đăng nhập khi credentials sai').toBe(false);

  // ASSERTION: URL vẫn phải là trang login
  expect(
    page.url(),
    'URL phải vẫn là trang login'
  ).toContain('/login');
});

// ============================================================
// TEST CASE 4: Logout User
// Mục tiêu: User đăng nhập được rồi đăng xuất thành công
// Lưu ý: TC này cần tài khoản đã tồn tại
//        Vì TC2 xóa tài khoản, TC4 cần tài khoản riêng
//        Trong practice này dùng setup fixture tạo trước
// ============================================================
test('TC4 - Logout User', async ({ page }) => {
  const homePage = new HomePage(page);
  const loginPage = new LoginPage(page);
  const signupPage = new SignupPage(page);
  const accountCreatedPage = new AccountCreatedPage(page);

  // Tạo user mới để dùng cho TC4 (vì TC2 đã xóa EXISTING_USER)
  const userData = generateUniqueUser();

  // ----------------------------------------------------------
  // SETUP: Tạo tài khoản mới trước khi test Logout
  // (Trong thực tế có thể dùng API setup hoặc beforeEach hook)
  // ----------------------------------------------------------
  await homePage.navigate();
  await homePage.clickSignupLogin();
  await loginPage.fillSignupForm(userData.name, userData.email);
  await page.waitForURL(/.*signup/);
  await signupPage.fillAccountDetails(userData);
  await signupPage.selectNewsletterAndOffers();
  await signupPage.fillAddressDetails(userData);
  await signupPage.clickCreateAccount();
  await accountCreatedPage.isAccountCreatedVisible();
  await accountCreatedPage.clickContinue();

  // Sau khi tạo tài khoản, user tự động login - Logout trước để test lại
  await homePage.clickLogout();

  // ----------------------------------------------------------
  // STEP 1-3: Mở trang chủ và xác nhận hiển thị
  // ----------------------------------------------------------
  await homePage.navigate();

  // ASSERTION: Trang chủ phải load thành công
  const isHomeVisible = await homePage.isHomePageVisible();
  expect(isHomeVisible, 'Trang chủ phải hiển thị thành công').toBe(true);

  // ----------------------------------------------------------
  // STEP 4: Click nút "Signup / Login"
  // ----------------------------------------------------------
  await homePage.clickSignupLogin();

  // ----------------------------------------------------------
  // STEP 5: Kiểm tra "Login to your account" hiển thị
  // ----------------------------------------------------------
  // ASSERTION: Heading phải visible
  const isLoginHeadingVisible = await loginPage.isLoginHeadingVisible();
  expect(isLoginHeadingVisible, '"Login to your account" phải hiển thị').toBe(true);

  // ----------------------------------------------------------
  // STEP 6-7: Nhập email/password đúng và click Login
  // ----------------------------------------------------------
  await loginPage.login(userData.email, userData.password);

  // ----------------------------------------------------------
  // STEP 8: Kiểm tra "Logged in as username" hiển thị
  // ----------------------------------------------------------
  // ASSERTION: User đã đăng nhập thành công
  await expect(
    page.locator('li a:has(b)'),
    '"Logged in as username" phải hiển thị'
  ).toBeVisible({ timeout: 10000 });

  const loggedInText = await homePage.getLoggedInText();
  expect(
    loggedInText,
    `Phải hiển thị "Logged in as ${userData.name}"`
  ).toContain(userData.name);

  // ASSERTION: Nút Logout phải hiển thị (chứng tỏ đang logged in)
  const isLogoutVisible = await homePage.isLogoutVisible();
  expect(isLogoutVisible, 'Nút Logout phải hiển thị khi đã đăng nhập').toBe(true);

  // ----------------------------------------------------------
  // STEP 9: Click "Logout"
  // ----------------------------------------------------------
  await homePage.clickLogout();

  // ----------------------------------------------------------
  // STEP 10: Kiểm tra user được chuyển về trang Login
  // ----------------------------------------------------------
  // ASSERTION: Phải được điều hướng về trang /login
  await expect(page, 'Phải được chuyển về trang Login sau khi Logout').toHaveURL(/.*login/);

  // ASSERTION: "Login to your account" heading phải hiển thị lại
  await expect(
    page.locator('.login-form h2'),
    '"Login to your account" phải hiển thị sau khi Logout'
  ).toBeVisible();

  // ASSERTION: User không còn logged in (không thấy "Logged in as")
  const isLoggedInAfterLogout = await homePage.isLoggedIn();
  expect(
    isLoggedInAfterLogout,
    'User không được hiển thị trạng thái đăng nhập sau khi Logout'
  ).toBe(false);

  // ----------------------------------------------------------
  // CLEANUP: Xóa tài khoản vừa tạo (optional nhưng best practice)
  // ----------------------------------------------------------
  // Đăng nhập lại để xóa tài khoản
  await loginPage.login(userData.email, userData.password);
  await homePage.clickDeleteAccount();
  // Chờ trang delete account load
  await page.waitForURL(/.*delete_account/);
});