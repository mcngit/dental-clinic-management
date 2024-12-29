const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// Enable CORS
app.use(cors());

// MySQL connection setup
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'DentalClinic'
});

db.connect(err => {
    if (err) {
        console.error('Database connection error:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Endpoint to fetch doctors
app.get('/doctors', (req, res) => {
    const query = 'SELECT * FROM Doctors';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching doctors:', err);
            res.status(500).send('Server error');
            return;
        }
        res.json(results);
    });
});

app.get('/appointments', (req, res) => {
    const query = `
        SELECT a.AppointmentID, p.Name AS PatientName, d.Name AS DoctorName, 
               a.AppointmentDate, a.AppointmentTime, a.Status
        FROM Appointments a
        JOIN Patients p ON a.PatientID = p.PatientID
        JOIN Doctors d ON a.DoctorID = d.DoctorID
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching appointments:', err);
            res.status(500).send('Server error');
            return;
        }
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
