import React, { useEffect, useState } from 'react';

const PatientProfiles = () => {
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/patients')
            .then(response => response.json())
            .then(data => setPatients(data))
            .catch(error => console.error('Error fetching patients:', error));
    }, []);

    return (
        <div>
            <h1>Patient Profiles</h1>
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
        </div>
    );
};

export default PatientProfiles;
