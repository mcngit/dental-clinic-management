const express = require('express');
const router = express.Router();
const db = require('../db'); // Ensure this matches your database connection file

router.get('/list', async (req, res) => {
    try {
        const [doctors] = await db.query('SELECT * FROM Doctors');
        res.json(doctors); // Send the array of doctors
    } catch (err) {
        console.error("Error fetching doctors:", err);
        res.status(500).json({ error: "Failed to fetch doctors." });
    }
});

module.exports = router;
