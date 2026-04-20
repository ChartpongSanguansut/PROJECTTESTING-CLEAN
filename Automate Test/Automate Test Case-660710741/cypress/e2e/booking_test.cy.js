// ไฟล์: booking_test.cy.js
// ผู้สร้าง Test Case: ไผ่ (คนที่ 6 ทีม B)
// ทดสอบระบบ SU Court Booking ตาม Flow จริง

describe('Automate Test สำหรับระบบจองสนาม (SU Court Booking)', () => {

  // ก่อนเริ่มเทสต์ทุกข้อ ให้ Login เข้ามารอที่หน้าแรกเสมอ
  beforeEach(() => {
    cy.login('661211319', 'users002')
    
    // ชัวร์ไว้ก่อนว่าเข้ามาหน้า homebooking แล้วจริงๆ
    cy.url().should('include', '/homebooking')
  })

  // ข้อ 1: Login
  it('Case 1: ควร Login สำเร็จและเข้าสู่หน้าแรกของการจองได้', () => {
    cy.contains('ระเบียบการจองสนามกีฬา').should('be.visible')
  })

  // ข้อ 2: ทะลุเข้าหน้าเลือกสนาม
  it('Case 2: กดปุ่ม "จองสนาม" แล้วต้องพาไปหน้า /booking ได้', () => {
    cy.contains('button', 'จองสนาม').click()
    
    cy.url().should('include', '/booking')
    cy.contains('เลือกสนาม').should('be.visible')
  })

  // ข้อ 3: การเลือกสนามและกดถัดไป (Positive)
  it('Case 3: ควรเลือก "แบดมินตัน1" และกด "เลือกเวลา" เพื่อไปสเต็ป 2 ได้', () => {
    // เข้าหน้าจอง
    cy.contains('button', 'จองสนาม').click()
    
    // คลิกเลือกสนาม (Flow ลื่นๆ ไม่ต้องมี cy.visit แล้ว!)
    cy.contains('button', 'แบดมินตัน1').click()
    
    // กดปุ่มเลือกเวลา
    cy.contains('button', 'เลือกเวลา').click()
    
    // เช็กว่าหน้าเลือกเวลาโผล่มาจริง
    cy.contains('เลือกเวลา').should('be.visible') 
  })

  // ข้อ 4: (🌟 ไฮไลท์!) ทดสอบบั๊กจำกัดสิทธิ์การจอง (Negative)
  it('Case 4: (Defect Found) ระบบแจ้ง Error "วันนี้จองสนามไปแล้ว" เมื่อพยายามจองคอร์ตที่ 2', () => {
    // 1. กดเข้าหน้าจองสนาม
    cy.contains('button', 'จองสนาม').click()
    
    // 2. เลือกสนามที่ 2
    cy.contains('button', 'แบดมินตัน2').click()
    cy.contains('button', 'เลือกเวลา').click()
    
    // 3. เลือกเวลาและกดยืนยัน
    cy.contains('17:30 - 18:30').click()
    cy.contains('button', 'ยืนยัน').click()
    cy.contains('button', 'จองสนาม').click()
    
    // 4. ดักจับข้อความแจ้งเตือน Error
    cy.contains('จองวันนี้ไปแล้ว').should('be.visible')
  })

  // ข้อ 5: ทดสอบปุ่มยกเลิกการจอง
  it('Case 5: กดปุ่ม "ยกเลิก" หน้าเลือกสนามแล้วต้องกลับไปหน้า homebooking', () => {
    // เข้าหน้าจอง
    cy.contains('button', 'จองสนาม').click()
    
    // สมมติเปลี่ยนใจ กดปุ่มยกเลิกสีแดง (แก้จากโค้ดเดิมที่มั่วซั่วให้เหลือแค่นี้พอ)
    cy.contains('button', 'ยกเลิก').click()
    
    // เช็กว่าเด้งกลับไปหน้าแรก
    cy.url().should('include', '/homebooking')
  })

})