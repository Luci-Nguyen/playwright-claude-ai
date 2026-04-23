

/**
 * Tạo thông tin user ngẫu nhiên để tránh xung đột khi đăng ký
 * Dùng timestamp để đảm bảo email luôn unique
 */
const generateUniqueUser = () => {
  const timestamp = Date.now();
  return {
    name: `TestUser${timestamp}`,
    email: `testuser${timestamp}@mailtest.com`,
    password: 'Test@1234',
    firstName: 'John',
    lastName: 'Doe',
    company: 'Test Company',
    address1: '123 Test Street',
    address2: 'Suite 456',
    country: 'United States',
    state: 'California',
    city: 'Los Angeles',
    zipcode: '90001',
    mobileNumber: '0123456789',
    dateOfBirth: { day: '15', month: 'March', year: '1995' },
    title: 'Mr',
  };
};

/**
 * Tài khoản dùng cho TC2 (Login đúng) và TC4 (Logout)
 * Lưu ý: Tài khoản này phải tồn tại trong hệ thống
 * Trong môi trường thực tế nên lưu trong .env
 */
const EXISTING_USER = {
  name: 'test_113',
  email: 'testexisting_1998@mailtest.com',
  password: '123456Hh@',
};

/**
 * Tài khoản sai dùng cho TC3 (Login sai)
 */
const INVALID_USER = {
  email: 'wrongemail@notexist.com',
  password: 'WrongPassword123',
};

module.exports = { generateUniqueUser, EXISTING_USER, INVALID_USER };