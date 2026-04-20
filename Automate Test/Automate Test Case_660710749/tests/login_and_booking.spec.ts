import { test, expect } from '@playwright/test';

const baseURL = 'https://su-courtbooking.vercel.app';

test.describe('Auth & Booking', () => {

 
  test('TC-AUTO-001: Login Success', async ({ page }) => {
    await page.goto(`${baseURL}/login`);

    await page.getByPlaceholder('Username').fill('661211319');
    await page.getByPlaceholder('Password').fill('users002');

    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForLoadState('networkidle');
    await expect(page).not.toHaveURL(/login/);

  });

  test('TC-AUTO-002: Login Fail - Wrong Password', async ({ page }) => {
    await page.goto(`${baseURL}/login`);

    await page.getByPlaceholder('Username').fill('661211319');
    await page.getByPlaceholder('Password').fill('unknown'); 
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('invalid username or password')).toBeVisible();
  });

  test('TC-AUTO-003: Access Booking without login', async ({ page }) => {
  await page.goto(`${baseURL}/booking`);
  await expect(page).toHaveURL(/login/);
  });

  test('TC-AUTO-004: Booking Court Success', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/login`);
    await page.getByPlaceholder('Username').fill('661211319');
    await page.getByPlaceholder('Password').fill('users002');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL(/.*homebooking/);
    await page.goto(`${baseURL}/booking`);
    

const courtBtn = page.locator('div.card-body, button, a').filter({ hasText: /^แบดมินตัน\s*1$/ }).first();

    await courtBtn.waitFor({ state: 'visible', timeout: 10000 });
    await courtBtn.click();
    await page.getByRole('button', { name: 'เลือกเวลา' }).click();
    await page.getByRole('button', { name: /18:30 - 19:30/ }).click();

const confirmBtn = page.getByRole('button', { name: 'ยืนยัน' });
    await expect(confirmBtn).toBeEnabled();
    await confirmBtn.click();

const finalBookingBtn = page.getByRole('button', { name: 'จองสนาม' });
    await expect(finalBookingBtn).toBeVisible();
    await finalBookingBtn.click();
    await page.waitForLoadState('networkidle');
    await expect(page.getByText(/จองสนามสำเร็จ|Success/)).toBeVisible({ timeout: 15000 });
    
  });

test('TC-005: Booking Validation - Missing Time Slot', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/login`);
    await page.getByPlaceholder('Username').fill('661211319');
    await page.getByPlaceholder('Password').fill('users002');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL(/.*homebooking/);
    await page.goto(`${baseURL}/booking`);
    await page.waitForLoadState('networkidle');

const courtBtn = page.getByRole('button', { name: /แบดมินตัน.*6/ }).first();

    await courtBtn.waitFor({ state: 'visible', timeout: 10000 });
    await expect(courtBtn).toBeVisible();
    await courtBtn.click();
    await page.getByRole('button', { name: 'เลือกเวลา' }).click();

const confirmButton = page.getByRole('button', { name: 'ยืนยัน' });
    await expect(confirmButton).toBeDisabled();

const alertInstruction = page.locator('.alert').filter({ hasText: 'กรุณาเลือกช่วงเวลาที่ต้องการจอง' });
    await expect(alertInstruction).toBeVisible();
  });
});
