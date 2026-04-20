import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* รันการทดสอบในไฟล์พร้อมกัน */
  fullyParallel: true,
  /* สั่งให้ Fail หากลืมใส่ test.only ในโค้ดตอนรันบน CI */
  forbidOnly: !!process.env.CI,
  /* รันซ้ำเมื่อเกิดข้อผิดพลาด (เฉพาะบน CI) */
  retries: process.env.CI ? 2 : 0,
  /* ตั้งค่าจำนวน Worker (เฉพาะบน CI) */
  workers: process.env.CI ? 1 : undefined,
  /* รูปแบบรายงานผลการทดสอบ */
  reporter: 'html',
  
  /* ตั้งค่าร่วมสำหรับการทดสอบทั้งหมด */
  use: {
    /* URL เริ่มต้นของระบบจองสนาม */
    baseURL: 'https://su-courtbooking.vercel.app',
    /* เก็บข้อมูล Trace เฉพาะตอนรันซ้ำเมื่อเกิดข้อผิดพลาด */
    trace: 'on-first-retry',
    /* ไม่เปิดหน้าจอ Browser ขึ้นมาขณะทดสอบ */
    headless: true,
  },

  /* การตั้งค่า Browser ที่ใช้ทดสอบ */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* รัน Local Dev Server ก่อนเริ่มเทส (ถ้าต้องการเปิดให้เอาคอมเมนต์ออก) */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});