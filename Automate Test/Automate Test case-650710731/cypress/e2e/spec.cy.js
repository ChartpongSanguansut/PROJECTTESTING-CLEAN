describe('Admin API - Transaction Oversight & Rules (TC05)', () => {

  // ตั้งค่า Base URL และ Mock Tokens (ปรับแก้ให้ตรงกับของจริงตอนรันนะจ๊ะ)
  const baseUrl = 'http://localhost:8080/v1';
  const adminToken = 'Bearer mock-admin-token-12345';
  const userToken = 'Bearer mock-user-token-67890';

  it('Auto-TC05-01: Verify API GET All Bookings (Positive Schema Test)', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}/admin/allbookings`,
      headers: { Authorization: adminToken }
    }).then((response) => {
      // ตรวจสอบ HTTP Status
      expect(response.status).to.eq(200);
      
      // ตรวจสอบ JSON Schema
      expect(response.body).to.be.an('array'); // หรือ response.body.bookings ถ้า API หุ้มด้วย object
      if (response.body.length > 0) {
        const firstBooking = response.body[0];
        // เช็กว่ามี key ครบถ้วนตาม Requirement
        expect(firstBooking).to.have.any.keys('booking_id', 'user_name', 'court_id', 'time_slot', 'status');
      }
    });
  });

  it('Auto-TC05-02: Verify Admin Cancel Booking Flow (Positive End-to-End)', () => {
    // สมมติว่าสร้าง Mock Booking ไว้แล้วและได้ ID = 999
    const targetBookingId = '999'; 
    const targetCourtId = '1';

    // Step 2: แอดมินกดยกเลิก
    cy.request({
      method: 'DELETE',
      url: `${baseUrl}/user/cancelbooking/${targetBookingId}`,
      headers: { Authorization: adminToken }
    }).then((response) => {
      expect(response.status).to.eq(200);
    });

    // Step 3: เช็กสถานะสนามว่ากลับมาว่างหรือไม่
    cy.request({
      method: 'GET',
      url: `${baseUrl}/user/timeslots/${targetCourtId}`,
      headers: { Authorization: adminToken }
    }).then((response) => {
      expect(response.status).to.eq(200);
      // หา slot เวลาของ booking ที่เพิ่งยกเลิกไป แล้วเช็กว่า is_available เป็น true
      // (สมมติว่าเป็น slot แรก)
      expect(response.body[0].is_available).to.be.true; 
    });
  });

  it('Auto-TC05-03: Verify Security Role on Cancel Endpoint (Negative Authorization)', () => {
    const targetBookingId = '888';

    cy.request({
      method: 'DELETE',
      url: `${baseUrl}/user/cancelbooking/${targetBookingId}`,
      headers: { Authorization: userToken },
      failOnStatusCode: false // สำคัญมาก! บอก Cypress ว่าถ้า Error 4xx ไม่ต้องให้ Test พัง แต่ให้ไปเช็กค่าต่อ
    }).then((response) => {
      // ต้องโดนเตะกลับด้วย 403 Forbidden
      expect(response.status).to.eq(403);
    });
  });

  it('Auto-TC05-04: Verify XSS Sanitization on Edit Rules (Negative Payload)', () => {
    const maliciousPayload = {
      rules: "<script>alert(document.cookie)</script><b>Test</b>"
    };

    // Step 1: แอดมินเผลอหรือตั้งใจเซฟ payload อันตราย
    // (สมมติว่า API เส้นนี้คือ /admin/rules ตามบริบท)
    cy.request({
      method: 'PUT', // หรือ POST
      url: `${baseUrl}/admin/rules`, 
      headers: { Authorization: adminToken },
      body: maliciousPayload
    }).then((response) => {
      expect(response.status).to.eq(200);
    });

    // Step 2: เรียกข้อมูลกลับมาดูว่าระบบ Escape HTML ไว้ไหม
    cy.request({
      method: 'GET',
      url: `${baseUrl}/admin/rules`,
      headers: { Authorization: adminToken }
    }).then((response) => {
      expect(response.status).to.eq(200);
      // ตรวจสอบว่าแท็ก <script> ถูกแปลงเป็น &lt;script&gt; ป้องกัน XSS
      expect(response.body.rules).to.not.include('<script>');
      expect(response.body.rules).to.include('&lt;script&gt;');
    });
  });

  it('Auto-TC05-05: Verify Empty Booking Date Handling (Positive Edge Case)', () => {
    const futureDate = '2028-12-31';

    cy.request({
      method: 'GET',
      url: `${baseUrl}/admin/allbookings?date=${futureDate}`,
      headers: { Authorization: adminToken }
    }).then((response) => {
      // ไม่ควรเกิด Server Error 500
      expect(response.status).to.eq(200);
      // ควรคืนค่ามาเป็น Array ว่าง
      expect(response.body).to.be.an('array').that.is.empty;
    });
  });

});
