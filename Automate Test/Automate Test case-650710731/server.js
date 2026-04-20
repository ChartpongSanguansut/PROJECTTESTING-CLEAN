const express = require('express');
const app = express();
const port = 8080;

app.use(express.json());

// ข้อมูลจำลอง (Mock Data)
let bookings = [
    { booking_id: '999', user_name: 'Pai ICT', court_id: '1', time_slot: '10:00', status: 'confirmed' }
];
let rules = { rules: "ข้อบังคับพื้นฐาน" };

// 1. GET All Bookings
app.get('/v1/admin/allbookings', (req, res) => {
    res.json(bookings);
});

// 2. Cancel Booking
app.delete('/v1/user/cancelbooking/:id', (req, res) => {
    const { id } = req.params;
    const auth = req.headers.authorization;

    // จำลองระบบ Security (TC05-03)
    if (auth === 'Bearer mock-user-token-67890') {
        return res.status(403).json({ message: 'Forbidden' });
    }

    bookings = bookings.filter(b => b.booking_id !== id);
    res.json({ message: 'Cancelled successfully' });
});

// 3. Get Timeslots (TC05-02 Step 3)
app.get('/v1/user/timeslots/:id', (req, res) => {
    res.json([{ slot: "10:00", is_available: true }]);
});

// 4. Update & Get Rules (TC05-04 XSS Test)
app.route('/v1/admin/rules')
    .get((req, res) => res.json(rules))
    .put((req, res) => {
        let newRules = req.body.rules;
        // จำลองการ Clean XSS (แทนที่ <script> ด้วยตัวอักษรปกติ)
        newRules = newRules.replace(/<script>/g, "&lt;script&gt;");
        rules.rules = newRules;
        res.json({ message: 'Rules updated' });
    });

app.listen(port, () => {
    console.log(`✅ Mock Server is running at http://localhost:${port}`);
    console.log(`🚀 Ready for Cypress to test!`);
});