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

app.get('/patients', (req, res) => {
    const { role } = req.headers; // Pass the role via headers

    if (role !== 'Admin') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const query = `
        SELECT 
            Patients.PatientID, 
            Patients.Name, 
            Patients.Email, 
            Patients.Phone, 
            Patients.Address, 
            GROUP_CONCAT(Appointments.AppointmentDate, ' - ', Appointments.Status SEPARATOR ', ') AS AppointmentHistory
        FROM Patients
        LEFT JOIN Appointments ON Patients.PatientID = Appointments.PatientID
        GROUP BY Patients.PatientID
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching patients:', err);
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

app.get('/appointments/all', (req, res) => {
    const query = `
        SELECT a.*, p.Name AS PatientName, d.Name AS DoctorName
        FROM Appointments a
        JOIN Patients p ON a.PatientID = p.PatientID
        JOIN Doctors d ON a.DoctorID = d.DoctorID
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching all appointments:', err);
            res.status(500).send('Server error');
            return;
        }
        res.json(results);
    });
});

app.post('/appointments/status', (req, res) => {
    const { appointmentId, newStatus } = req.body;

    const query = `UPDATE Appointments SET Status = ? WHERE AppointmentID = ?`;
    db.query(query, [newStatus, appointmentId], (err, result) => {
        if (err) {
            console.error('Error updating status:', err);
            res.status(500).json({ success: false, message: 'Database error' });
            return;
        }

        if (result.affectedRows === 0) {
            res.status(404).json({ success: false, message: 'Appointment not found' });
            return;
        }

        res.json({ success: true });
    });
});


app.post('/appointments/note', (req, res) => {
    const { appointmentId, note } = req.body;
    const query = `UPDATE Appointments SET Notes = ? WHERE AppointmentID = ?`;
    db.query(query, [note, appointmentId], (err, result) => {
        if (err) {
            console.error('Error adding note:', err);
            res.status(500).json({ success: false });
            return;
        }
        res.json({ success: true });
    });
});

app.delete('/appointments/delete/:appointmentId', (req, res) => {
    const { appointmentId } = req.params;
    const query = `DELETE FROM Appointments WHERE AppointmentID = ?`;
    db.query(query, [appointmentId], (err, result) => {
        if (err) {
            console.error('Error deleting appointment:', err);
            res.status(500).json({ success: false });
            return;
        }
        res.json({ success: true });
    });
});

// Fetch appointments for a specific patient
app.get('/appointments/patient/:patientId', (req, res) => {
    const { patientId } = req.params;
    const query = `
        SELECT a.*, d.Name AS DoctorName
        FROM Appointments a
        JOIN Doctors d ON a.DoctorID = d.DoctorID
        WHERE a.PatientID = ?
    `;
    db.query(query, [patientId], (err, results) => {
        if (err) {
            console.error('Error fetching patient appointments:', err);
            res.status(500).send('Server error');
            return;
        }
        res.json(results);
    });
});

// Fetch appointments for a specific doctor
app.get('/appointments/doctor/:doctorId', (req, res) => {
    const { doctorId } = req.params;

    const query = `
        SELECT a.*, p.Name AS PatientName
        FROM Appointments a
        JOIN Patients p ON a.PatientID = p.PatientID
        WHERE a.DoctorID = ?
    `;

    db.query(query, [doctorId], (err, results) => {
        if (err) {
            console.error('Error fetching doctor appointments:', err);
            res.status(500).send('Server error');
            return;
        }
        res.json(results);
    });
});

app.get('/profile/:id/:role', (req, res) => {
    const { id, role } = req.params;

    const table = role === 'Admin' ? 'Doctors' : 'Patients';
    const idField = role === 'Admin' ? 'DoctorID' : 'PatientID';

    const query = `SELECT * FROM ${table} WHERE ${idField} = ?`;
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error fetching profile:', err);
            res.status(500).send('Server error');
            return;
        }
        if (results.length === 0) {
            res.status(404).send('User not found');
            return;
        }
        res.json(results[0]);
    });
});

app.post('/doctors/availability', (req, res) => {
    const { doctorId, availability } = req.body;

    if (!doctorId || !availability || !Array.isArray(availability)) {
        return res.status(400).json({ success: false, message: 'Invalid input.' });
    }

    const availabilityString = JSON.stringify(availability);

    const query = `UPDATE Doctors SET AvailableDays = ? WHERE DoctorID = ?`;
    db.query(query, [availabilityString, doctorId], (err, result) => {
        if (err) {
            console.error('Error saving availability:', err);
            return res.status(500).json({ success: false, message: 'Server error.' });
        }

        res.json({ success: true, message: 'Availability saved successfully.' });
    });
});

app.get('/doctors/availability/:doctorId', (req, res) => {
    const { doctorId } = req.params;

    const query = `SELECT AvailableDays FROM Doctors WHERE DoctorID = ?`;
    db.query(query, [doctorId], (err, results) => {
        if (err) {
            console.error('Error fetching availability:', err);
            res.status(500).send('Server error');
            return;
        }

        if (results.length === 0) {
            res.status(404).send('Doctor not found');
            return;
        }

        const availability = JSON.parse(results[0].AvailableDays || '[]');
        res.json({ availability });
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

        // Add additional fields to the user object
        const userData = {
            id: role === 'Admin' ? user.DoctorID : user.PatientID,
            name: user.Name,
            email: user.Email,
            phone: user.Phone,
            address: user.Address || null,
            specialization: user.Specialization || null,
            availableSlots: user.AvailableSlots || null,
            role,
        };

        res.status(200).json({
            message: 'Login successful',
            user: userData,
        });
    });
});

app.post('/profile/update', (req, res) => {
    const { id, role, email, phone, address, password, specialization, availableSlots } = req.body;

    const table = role === 'Admin' ? 'Doctors' : 'Patients';
    const idField = role === 'Admin' ? 'DoctorID' : 'PatientID';

    let query = `UPDATE ${table} SET Phone = ?`;
    const values = [phone];

    if (role === 'Patient') {
        query += `, Address = ?`;
        values.push(address);
    } else if (role === 'Admin') {
        query += `, Specialization = ?, AvailableSlots = ?`;
        values.push(specialization, availableSlots);
    }

    if (password) {
        const hashedPassword = hashPassword(password);
        query += `, PasswordHash = ?`;
        values.push(hashedPassword);
    }

    query += ` WHERE ${idField} = ?`;
    values.push(id);

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error updating profile:', err);
            res.status(500).json({ success: false, message: 'Error updating profile' });
            return;
        }
        res.status(200).json({ success: true, message: 'Profile updated successfully' });
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

app.post('/appointments/book', (req, res) => {
    const { patientId, doctorId, date, time } = req.body;

    // Check if the selected time is already booked
    const checkQuery = `
        SELECT * FROM Appointments
        WHERE DoctorID = ? AND AppointmentDate = ? AND AppointmentTime = ?
    `;
    db.query(checkQuery, [doctorId, date, time], (err, results) => {
        if (err) {
            console.error('Error checking appointment availability:', err);
            res.status(500).json({ success: false, message: 'Server error' });
            return;
        }

        if (results.length > 0) {
            res.status(400).json({ success: false, message: 'Selected time slot is already booked.' });
            return;
        }

        // Insert the new appointment
        const insertQuery = `
            INSERT INTO Appointments (PatientID, DoctorID, AppointmentDate, AppointmentTime, Status)
            VALUES (?, ?, ?, ?, 'Scheduled')
        `;
        db.query(insertQuery, [patientId, doctorId, date, time], (err, result) => {
            if (err) {
                console.error('Error booking appointment:', err);
                res.status(500).json({ success: false, message: 'Error booking appointment' });
                return;
            }
            res.status(200).json({ success: true, message: 'Appointment booked successfully' });
        });
    });
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
