import React, { useEffect, useState } from 'react';

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
        <div>
            <h1>Patient Profiles</h1>
            {loggedInUser?.role !== 'Admin' ? (
                <p>Access Denied: You do not have permission to view this page.</p>
            ) : (
                <ul>
                    {patients.map(patient => (
                        <li key={patient.PatientID}>
                            <h2>{patient.Name}</h2>
                            <p>Email: {patient.Email}</p>
                            <p>Phone: {patient.Phone}</p>
                            <p>Address: {patient.Address}</p>
                            <p>
                                Appointment History:
                                <br />
                                {patient.AppointmentHistory
                                    ? patient.AppointmentHistory.split(',').map((appt, index) => (
                                          <span key={index}>{appt}<br /></span>
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
