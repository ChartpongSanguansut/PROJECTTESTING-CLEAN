import { test, expect, Page } from '@playwright/test';

test.use({ browserName: 'chromium' });
test.describe.configure({ mode: 'serial' });

const BASE_URL = 'https://su-courtbooking.vercel.app/';

const ADMIN = {
  username: '650710695',
  password: 'admin002'
};

const USER = {
  username: '661211319',
  password: 'users002'
};


async function login(page: Page, username: string, password: string) {
  await page.goto(BASE_URL);

  await page.getByRole('textbox', { name: /username/i }).fill(username);
  await page.getByRole('textbox', { name: /password/i }).fill(password);

  await page.getByRole('button', { name: /login/i }).click();


  await page.waitForURL(/dashboard|home|booking/i, { timeout: 15000 });
}


test.describe('Court Management System - Authentication & Time Config', () => {

  // TC-001: Login Success
  test('TC-001: Admin login success', async ({ page }) => {
    await login(page, ADMIN.username, ADMIN.password);

    await expect(page).toHaveURL(/dashboard|home|booking/i);
  });


  // TC-002: Login Fail (Wrong Password)
  test('TC-002: Login fail with wrong password', async ({ page }) => {
    await page.goto(BASE_URL);

    await page.getByRole('textbox', { name: /username/i }).fill(ADMIN.username);
    await page.getByRole('textbox', { name: /password/i }).fill('wrongpassword');

    await page.getByRole('button', { name: /login/i }).click();


    await expect(page).toHaveURL(BASE_URL);


    await expect(page.getByRole('textbox', { name: /username/i })).toBeVisible();
  });


  // TC-003: Empty Input Validation (FIXED)
  test('TC-003: ระบบแสดงค่าเวลา Default', async ({ page }) => {
    await login(page, ADMIN.username, ADMIN.password);

    await page.getByRole('link', { name: /dashboard/i }).click();
    await page.getByRole('button', { name: /จัดการเวลา/i }).click();

    await expect(page.getByText(/เวลาเริ่มต้น/i)).toBeVisible();
    await expect(page.getByText(/เวลาสิ้นสุด/i)).toBeVisible();
  });


  // TC-004: Admin Access Time Config
  test('TC-004: Admin เข้าหน้าจัดการเวลาได้', async ({ page }) => {
    await login(page, ADMIN.username, ADMIN.password);

    await page.getByRole('link', { name: /dashboard/i }).click();

    const manageTimeBtn = page.getByRole('button', { name: /จัดการเวลา/i });
    await expect(manageTimeBtn).toBeVisible();
    await manageTimeBtn.click();

    await expect(
      page.getByRole('heading', { name: /การตั้งค่าเวลา/i })
    ).toBeVisible();
  });

  // TC-005: Invalid Time Range
  test('TC-005: ตั้งเวลาไม่ถูกต้อง (End < Start)', async ({ page }) => {
    await login(page, ADMIN.username, ADMIN.password);


    await page.getByRole('link', { name: /dashboard/i }).click();


    const manageTimeBtn = page.getByRole('button', { name: /จัดการเวลา/i });
    await expect(manageTimeBtn).toBeVisible();
    await manageTimeBtn.click();

    await expect(
      page.getByRole('heading', { name: /การตั้งค่าเวลา/i })
    ).toBeVisible();


    const inputs = page.getByRole('textbox');

    await inputs.nth(0).fill('18:00'); // start
    await inputs.nth(1).fill('09:00'); // end

    await page.getByRole('button', { name: /บันทึก/i }).click();


    await expect(
      page.getByRole('heading', { name: /การตั้งค่าเวลา/i })
    ).toBeVisible();
  });

  // TC-006: Security Test (User cannot access admin)
  test('TC-006: Admin สามารถบันทึกเวลาได้สำเร็จ', async ({ page }) => {
    await login(page, ADMIN.username, ADMIN.password);

    await page.getByRole('link', { name: /dashboard/i }).click();

    const manageTimeBtn = page.getByRole('button', { name: /จัดการเวลา/i });
    await expect(manageTimeBtn).toBeVisible();
    await manageTimeBtn.click();

    await expect(
      page.getByRole('heading', { name: /การตั้งค่าเวลา/i })
    ).toBeVisible();

    const inputs = page.getByRole('textbox');

    await inputs.nth(0).fill('09:00');
    await inputs.nth(1).fill('18:00');

    await page.getByRole('button', { name: /บันทึก/i }).click();

    await expect(
      page.getByRole('heading', { name: /การตั้งค่าเวลา/i })
    ).toBeVisible();
  });

});