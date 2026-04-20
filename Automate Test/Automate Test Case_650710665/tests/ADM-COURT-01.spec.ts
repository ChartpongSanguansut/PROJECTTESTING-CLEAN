import { test, expect } from '@playwright/test';

// ตั้งค่าให้ใช้ Chromium และรันต่อกันทีละเทส (ป้องกัน Session ตีกัน)
test.use({ browserName: 'chromium' });
test.describe.configure({ mode: 'serial' });

const USERNAME = '650710695';
const PASSWORD = 'admin002';
const BASE_URL = 'https://su-courtbooking.vercel.app';

// ==========================================
// HELPER: LOGIN FUNCTION
// ==========================================
async function login(page) {
  await page.goto(BASE_URL);
  // ระบุช่องกรอกให้ชัดเจน
  await page.locator('input[type="text"]').fill(USERNAME);
  await page.locator('input[type="password"]').fill(PASSWORD);
  // กดปุ่ม Login
  await page.getByRole('button', { name: /login|เข้าสู่ระบบ/i }).click();
  // รอจนกว่าจะเข้าสู่หน้าหลัก
  await page.waitForURL(/\/(home|booking|dashboard|alltodaybookings)/i, { timeout: 15000 });
}

test.describe('Court Management System - Admin (Full Suite)', () => {

  // TC-01: เพิ่มสนามใหม่สำเร็จ (ADM-01)
  test('TC-01: เพิ่มสนามใหม่สำเร็จ', async ({ page }) => {
    await login(page);
    await page.getByRole('link', { name: 'จัดการสนาม' }).click();

    // รอปุ่มเพิ่มสนามและคลิก (ใช้ Regex เพื่อความยืดหยุ่น)
    const addBtn = page.getByRole('button', { name: /\+ เพิ่มสนามใหม่|เพิ่มสนาม/i });
    await expect(addBtn).toBeVisible();
    await addBtn.click();

    await page.getByPlaceholder('เช่น ฟุตบอล3').fill('แบดมินตัน 50');
    await page.getByRole('button', { name: /บันทึก/i }).click();

    // ตรวจสอบผลลัพธ์
    await expect(page.getByText(/สำเร็จ|success/i)).toBeVisible();
  });

  // TC-02: เพิ่มสนามโดยไม่กรอกชื่อ (ADM-02)
  test('TC-02: เพิ่มสนามโดยไม่กรอกชื่อ', async ({ page }) => {
    await login(page);
    await page.getByRole('link', { name: 'จัดการสนาม' }).click();
    await page.getByRole('button', { name: /เพิ่มสนาม/i }).click();

    const nameInput = page.getByPlaceholder('เช่น ฟุตบอล3');
    await nameInput.fill('');
    await nameInput.blur(); // Trigger Validation

    await page.getByRole('button', { name: /บันทึก/i }).click();

    // ตรวจสอบข้อความเตือน
    await expect(page.getByText(/กรุณากรอกชื่อสนาม|ใส่ชื่อสนาม/i)).toBeVisible();
  });

  // TC-03: เพิ่มสนามชื่อซ้ำ (ADM-03)
  test('TC-03: เพิ่มสนามชื่อซ้ำ', async ({ page }) => {
    await login(page);
    await page.getByRole('link', { name: 'จัดการสนาม' }).click();
    await page.getByRole('button', { name: /เพิ่มสนาม/i }).click();

    // กรอกชื่อที่มีอยู่แล้ว
    await page.getByPlaceholder('เช่น ฟุตบอล3').fill('แบดมินตัน 1');
    await page.getByRole('button', { name: /บันทึก/i }).click();

    // ตรวจสอบ Error ข้อความชื่อซ้ำ
    await expect(page.getByText(/มีอยู่ในระบบแล้ว|ชื่อซ้ำ/i)).toBeVisible();
  });

  // TC-04: แก้ไขชื่อสนาม (ADM-04)
  test('TC-04: แก้ไขชื่อสนาม', async ({ page }) => {
    await login(page);
    await page.getByRole('link', { name: 'จัดการสนาม' }).click();

    // หาแถวที่มีสนาม 'แบดมินตัน 1'
    const row = page.locator('tr', { hasText: 'แบดมินตัน 1' }).first();
    await expect(row).toBeVisible();
    await row.getByRole('button', { name: /แก้ไข/i }).click();

    const input = page.getByPlaceholder('เช่น ฟุตบอล3');
    await input.fill('เทนนิส 2');
    await page.getByRole('button', { name: /บันทึก/i }).click();

    await expect(page.locator('body')).toContainText(/สำเร็จ|success/i);
  });

  // TC-05: แก้ไขชื่อสนามอีกครั้ง (ADM-05/11)บ
  test('TC-05: แก้ไขชื่อสนามอีกครั้ง', async ({ page }) => {
    await login(page);
    await page.getByRole('link', { name: 'จัดการสนาม' }).click();

    // ค้นหาแถว 'เทนนิส 1'
    const row = page.locator('tr').filter({ hasText: 'เทนนิส 1' }).first();
    await expect(row).toBeVisible({ timeout: 10000 });
    await row.getByRole('button', { name: /แก้ไข/i }).click();

    const input = page.getByPlaceholder('เช่น ฟุตบอล3');
    await expect(input).toBeVisible();
    await input.clear();
    await input.fill('ฟุตซอล 3');

    // คลิกปุ่มบันทึกการแก้ไข
    await page.getByRole('button', { name: /บันทึกการแก้ไข|บันทึก/i }).click();

    // ตรวจสอบผลลัพธ์
    await expect(page.getByText(/สำเร็จ|success/i)).toBeVisible();
    await expect(input).not.toBeVisible(); // มั่นใจว่า Modal ปิดแล้ว
  });

});