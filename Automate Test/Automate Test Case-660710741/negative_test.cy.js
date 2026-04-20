// ไฟล์: negative_test.cy.js
// แผนกทำลายล้างระบบ: ไผ่ ทีม B

describe('สายดาร์ก: ทดสอบพังระบบ (Negative & Edge Cases)', () => {

  // ข้อ 1: ยูสเซอร์ขี้เกียจ ไม่กรอกอะไรเลยแล้วกด Login
  it('Case 1: ไม่กรอกข้อมูล กด Login แล้วต้องไม่ผ่าน', () => {
    cy.visit('/login') // ใช้ baseUrl ได้เลย!
    cy.get('button[type="submit"]').click()
    
    // คาดหวังว่าระบบจะไม่ยอมให้ผ่าน และ URL ยังคงค้างอยู่ที่หน้า login
    cy.url().should('include', '/login')
  })

  // ข้อ 2: ยูสเซอร์มึน กรอกรหัสผิด
  it('Case 2: กรอกรหัสผิด ต้องเข้าไม่ได้', () => {
    cy.visit('/login')
    cy.get('input[placeholder="Username"]').type('661211319')
    cy.get('input[placeholder="Password"]').type('wrongpassword123') // รหัสผิด!
    cy.get('button[type="submit"]').click()

    // คาดหวังว่า URL ยังอยู่ที่เดิม
    cy.url().should('include', '/login')
    
    // 💡 (ท่าเสริม) ถ้าเว็บไผ่มีแจ้งเตือนว่า "รหัสผ่านไม่ถูกต้อง" 
    // ไผ่สามารถเอาคอมเมนต์บรรทัดล่างนี้ออก แล้วแก้ข้อความให้ตรงกับเว็บได้เลย
    // cy.contains('รหัสผ่านไม่ถูกต้อง').should('be.visible')
  })

  // ข้อ 3: แฮกเกอร์ แอบพิมพ์ URL เข้าหน้าจองตรงๆ โดยไม่ล็อกอิน
  it('Case 3: ไม่ล็อกอินแต่พิมพ์เข้า /booking ตรงๆ ระบบต้องเตะกลับ', () => {
    // แอบพิมพ์ URL หวังจะข้ามหน้า Login
    cy.visit('/booking')
    
    // ระบบที่ดี ต้องรู้ทันและเตะโด่งกลับมาหน้า Login!
    cy.url().should('include', '/login')
  })

})