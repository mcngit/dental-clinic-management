const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = 3000;
const bcrypt = require('bcrypt');

// Password hashing and verification functions
function hashPassword(password) {
    const saltRounds = 10;
    return bcrypt.hashSync(password, saltRounds);
}
function verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compareSync(plainPassword, hashedPassword);
}

// Enable CORS
app.use(cors());
app.use(express.json());

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

app.post('/login', (req, res) => {
    const { email, password, role } = req.body;

    const table = role === 'Admin' ? 'Doctors' : 'Patients';
    const query = `SELECT * FROM ${table} WHERE Email = ?`;

    db.query(query, [email], (err, results) => {
        if (err) {
            console.error('Error during login:', err);
            res.status(500).json({ message: 'Server error' });
            return;
        }

        if (results.length === 0) {
            console.log('No user found for email:', email);
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }

        const user = results[0];
        console.log('Found user:', user); // Debugging

        // Verify the password
        const isPasswordValid = verifyPassword(password, user.PasswordHash);
        console.log('Password verification result:', isPasswordValid);

        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }

        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user[role === 'Admin' ? 'DoctorID' : 'PatientID'],
                name: user.Name,
                role,
            },
        });
    });
});

// Test the password hashing and verification functions
app.get('/test-hash', (req, res) => {
    const plainPassword = 'test';
    const hashedPassword = hashPassword(plainPassword);
    const isValid = verifyPassword(plainPassword, hashedPassword);
    res.json({ hashedPassword, isValid });
});




app.post('/signup/doctor', (req, res) => {
    const { name, email, password, phone, specialization, availableSlots } = req.body;

    // Hash the password
    const hashedPassword = hashPassword(password);

    // Insert into Doctors table
    const query = `
        INSERT INTO Doctors (Name, Email, PasswordHash, Phone, Specialization, AvailableSlots)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(query, [name, email, hashedPassword, phone, specialization, availableSlots], (err, result) => {
        if (err) {
            console.error('Error signing up doctor:', err);
            res.status(500).send('Server error');
            return;
        }
        res.status(201).send('Doctor signed up successfully');
    });
});

app.post('/signup/patient', (req, res) => {
    const { name, email, password, phone, address } = req.body;

    console.log('Request received:', { name, email, phone, address });

    try {
        // Hash the password (ensure `hashPassword` is implemented)
        const hashedPassword = hashPassword(password);

        console.log('Password hashed successfully:', hashedPassword);

        // Insert into Patients table
        const query = `
            INSERT INTO Patients (Name, Email, PasswordHash, Phone, Address)
            VALUES (?, ?, ?, ?, ?)
        `;
        const values = [name, email, hashedPassword, phone, address];

        db.query(query, values, (err, result) => {
            if (err) {
                console.error('Database error:', err);
                res.status(500).json({ success: false, message: 'Database error' });
                return;
            }

            console.log('Patient signed up successfully:', result);
            res.status(201).json({ success: true, message: 'Patient signed up successfully' });
        });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
