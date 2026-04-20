import { test, expect } from '@playwright/test';

// =============================
// CONFIG
// =============================
const BASE_URL = 'https://su-courtbooking.vercel.app';

// 👇 ใส่ข้อมูลจริงของคุณตรงนี้
const USERNAME = '661211319';
const PASSWORD = 'users002';

// =============================
// HELPER: LOGIN
// =============================
async function login(page) {
    await page.goto(BASE_URL);

    // กรอก username / password
    await page.locator('input').nth(0).fill(USERNAME);
    await page.locator('input').nth(1).fill(PASSWORD);

    // กดปุ่มเข้าสู่ระบบ
    await page.getByRole('button').click();

    // รอให้เข้าเว็บหลัง login
    await page.waitForLoadState('networkidle');
}

// =============================
// HELPER: GO TO PROFILE
// =============================
async function goToProfile(page) {
    await page.getByRole('link', { name: 'โปรไฟล์' }).click();
    await page.waitForLoadState('networkidle');
}

// =============================
// HELPER: GO TO MY BOOKINGS
// =============================
async function goToMyBookings(page) {
    await page.getByRole('link', { name: 'การจองของฉัน' }).click();
    await page.waitForLoadState('networkidle');
}

// =============================
// TC-001 Login สำเร็จ
// =============================
test('TC-001 Login สำเร็จ', async ({ page }) => {
    await login(page);

    // รอให้ URL เปลี่ยน (สำคัญมากสำหรับ WebKit)
    await page.waitForURL(/homebooking|alltodaybookings|mybookings|profile/, {
        timeout: 10000,
    });

    // เช็คอีกครั้งว่าอยู่หน้าภายในระบบ
    await expect(page).toHaveURL(/homebooking|alltodaybookings|mybookings|profile/);
});

// =============================
// TC-013 ค้นหาโดยไม่เลือกวันที่
// =============================
test('TC-013 ค้นหาโดยไม่เลือกวันที่', async ({ page }) => {
    await login(page);

    // เข้าเมนู "การจองของฉัน"
    await page.getByRole('link', { name: 'การจองของฉัน' }).click();

    // รอหน้าโหลด
    await page.waitForLoadState('networkidle');

    // กดปุ่ม "ค้นหา" โดยไม่เลือกวันที่
    await page.getByRole('button', { name: 'ค้นหา' }).click();

    // รอข้อความเตือนขึ้น
    await page.waitForTimeout(1000);

    // ตรวจสอบข้อความแจ้งเตือน
    await expect(
        page.locator('text=กรุณาเลือกวันที่เริ่มต้นหรือวันที่สิ้นสุดอย่างน้อย 1 วัน')
    ).toBeVisible();
});

// =============================
// TC-018 กรอกเบอร์โทรไม่ครบ 10 หลัก
// =============================
test('TC-018 กรอกเบอร์โทรไม่ครบ 10 หลัก', async ({ page }) => {
    await login(page);
    await goToProfile(page);

    // หา section โปรไฟล์
    const profileSection = page.locator('text=เบอร์ติดต่อ').locator('..');

    // คลิกปุ่มแก้ไขที่อยู่ใกล้ "เบอร์ติดต่อ"
    await profileSection.locator('svg').click();

    // รอ popup / input เด้งขึ้น
    await page.waitForTimeout(1000);

    // หา input เบอร์โทรที่เปิดขึ้นมา
    const phoneInput = page.locator('input').last();
    await phoneInput.click();
    await phoneInput.fill('123');

    // กดบันทึก
    await page.getByRole('button', { name: 'บันทึก' }).click();

    // รอข้อความแจ้งเตือน
    await page.waitForTimeout(1000);

    // ตรวจสอบข้อความเตือน
    await expect(
        page.locator('text=** กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (10 หลัก ตัวเลขเท่านั้น)')
    ).toBeVisible();
});

// =============================
// TC-019 กรอกเบอร์โทรเป็นตัวอักษร
// =============================
test('TC-019 กรอกเบอร์โทรเป็นตัวอักษร', async ({ page }) => {
    await login(page);
    await goToProfile(page);

    // คลิกแก้ไขเบอร์
    await page.locator('text=เบอร์ติดต่อ').locator('..').locator('svg').click();

    // รอ input แสดง
    await page.waitForTimeout(1000);

    // กรอกค่าเป็นตัวอักษร
    const phoneInput = page.locator('input').last();
    await phoneInput.click();
    await phoneInput.fill('fffff');

    // กดบันทึก
    await page.getByRole('button', { name: 'บันทึก' }).click();

    // ตรวจสอบข้อความเตือน
    await expect(
        page.locator('text=** กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (10 หลัก ตัวเลขเท่านั้น)')
    ).toBeVisible();
});

// =============================
// TC-020 กดปุ่มยกเลิกแล้ว popup แสดง
// =============================
test('TC-020 กดยกเลิกแล้ว popup ยืนยันแสดง', async ({ page }) => {
  await login(page);

  await page.getByRole('link', { name: 'การจองของฉัน' }).click();
  await page.waitForLoadState('networkidle');

  // เช็คว่ามีปุ่ม "ยกเลิก" หรือไม่
  const cancelBtn = page.getByRole('button', { name: 'ยกเลิก' });

  if (await cancelBtn.count() > 0) {
    await cancelBtn.click();9

    await expect(
      page.locator('text=ยืนยันการยกเลิก')
    ).toBeVisible();
  } else {
    console.log('ไม่มีรายการจอง → ข้าม test นี้');
  }
});