# Automation Exercise - Playwright POM Test Suite

Dự án automation test cho website [automationexercise.com](https://automationexercise.com) sử dụng **Playwright** và mô hình **Page Object Model (POM)**.

---

## 📁 Cấu trúc Project

```
playwright-pom/
├── pages/                        # Page Object Classes
│   ├── BasePage.js               # Lớp cha - chứa method dùng chung
│   ├── HomePage.js               # Trang chủ
│   ├── LoginPage.js              # Trang Login / Signup
│   ├── SignupPage.js             # Trang điền thông tin đăng ký
│   ├── AccountCreatedPage.js     # Trang xác nhận tạo tài khoản
│   └── AccountDeletedPage.js     # Trang xác nhận xóa tài khoản
├── tests/
│   └── auth.spec.js              # TC1-TC4: Authentication tests
├── test-data/
│   └── users.js                  # Dữ liệu test tập trung
├── playwright.config.js          # Cấu hình Playwright
├── package.json
└── README.md
```

---

## 🧪 Các Test Case

| TC  | Tên                                          | Mô tả                                               |
|-----|----------------------------------------------|-----------------------------------------------------|
| TC1 | Register User                                | Đăng ký tài khoản mới, xác nhận và xóa tài khoản  |
| TC2 | Login User with correct email and password   | Đăng nhập thành công, xác nhận và xóa tài khoản   |
| TC3 | Login User with incorrect email and password | Đăng nhập sai, kiểm tra thông báo lỗi             |
| TC4 | Logout User                                  | Đăng nhập rồi đăng xuất, xác nhận về trang Login  |

---

## ⚙️ Cài đặt

### Yêu cầu
- Node.js >= 16

### Các bước cài đặt

```bash
# 1. Cài dependencies
npm install

# 2. Cài Playwright browsers
npx playwright install chromium
```

---

## ▶️ Chạy Test

```bash
# Chạy tất cả test
npm test

# Chạy với browser hiển thị (headed mode)
npm run test:headed

# Chạy test cụ thể theo tên
npx playwright test --grep "TC1"
npx playwright test --grep "TC3"

# Chạy với Playwright UI (debug mode)
npm run test:ui

# Xem report sau khi chạy
npm run report
```

---

## 🏗️ Kiến trúc Page Object Model

```
Test File (auth.spec.js)
    │
    ├── HomePage          → Locators & actions cho trang chủ
    ├── LoginPage         → Locators & actions cho form Login/Signup
    ├── SignupPage         → Locators & actions cho form đăng ký chi tiết
    ├── AccountCreatedPage → Locators & actions trang xác nhận tạo TK
    └── AccountDeletedPage → Locators & actions trang xác nhận xóa TK
         │
         └── BasePage (kế thừa) → navigate(), scrollToBottom(), ...
```

---

## 📌 Lưu ý quan trọng

### TC2 - Login với tài khoản đúng
TC2 cần một tài khoản đã tồn tại. Cập nhật `EXISTING_USER` trong `test-data/users.js`:

```js
const EXISTING_USER = {
  name: 'YourName',
  email: 'your_real_email@example.com',
  password: 'YourPassword',
};
```

Tốt nhất nên dùng **API setup** hoặc **beforeAll hook** để tạo tài khoản trước khi chạy TC2.

### TC4 - Logout
TC4 tự tạo user mới trong quá trình test để đảm bảo độc lập với TC2.

---

## 🔍 Assertion Strategy

Mỗi test case đều có các assertion:
- **Visibility assertions**: `expect(locator).toBeVisible()`
- **Text content assertions**: `expect(text).toContain('...')`
- **URL assertions**: `expect(page).toHaveURL(/pattern/)`
- **State assertions**: `expect(checkbox).toBeChecked()`
- **Negative assertions**: `expect(condition).toBe(false)` — đảm bảo KHÔNG xảy ra điều không mong muốn