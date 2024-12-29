const express = require('express');
const router = express.Router();

// Example route
router.get('/', (req, res) => {
    res.json({ message: "Patients API working!" }); // Send valid JSON
});

router.get('/list', async (req, res) => {
    try {
        const patients = await db.query('SELECT * FROM Patients');
        res.json(patients); // Send patients as JSON
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch patients." });
    }
});


module.exports = router;
