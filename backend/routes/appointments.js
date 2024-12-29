const express = require('express');
const router = express.Router();

// Example route
router.get('/', (req, res) => {
    res.send('Appointments API working!');
});

module.exports = router;
