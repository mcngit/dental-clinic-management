import React, { useEffect, useState } from 'react';
import "../styles/PatientProfiles.css"

const PatientProfiles = ({ loggedInUser }) => {
    const [patients, setPatients] = useState([]); // Initialize patients state

    useEffect(() => {
        // Ensure this fetch is restricted to admins
        if (loggedInUser && loggedInUser.role === 'Admin') {
            fetch('http://localhost:3000/patients', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    role: loggedInUser.role, // Pass role as header
                },
            })
                .then(response => {
                    if (response.status === 403) {
                        throw new Error('Access denied.');
                    }
                    return response.json();
                })
                .then(data => setPatients(data)) // Set fetched patients in state
                .catch(error => console.error('Error fetching patients:', error));
        }
    }, [loggedInUser]);

    return (
        <div className="patient-profiles-container">
            <h1>Patient Profiles</h1>
            {loggedInUser?.role !== 'Admin' ? (
                <p className="access-denied">
                    Access Denied: You do not have permission to view this page.
                </p>
            ) : (
                <ul className="patient-list">
                    {patients.map(patient => (
                        <li key={patient.PatientID} className="patient-card">
                            <h2>{patient.Name}</h2>
                            <p>Email: {patient.Email}</p>
                            <p>Phone: {patient.Phone}</p>
                            <p>Address: {patient.Address}</p>
                            <p className="appointment-history">
                                Appointment History:
                                <br />
                                {patient.AppointmentHistory
                                    ? patient.AppointmentHistory.split(',').map((appt, index) => (
                                          <span key={index}>{appt}</span>
                                      ))
                                    : 'No appointments yet'}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PatientProfiles;
