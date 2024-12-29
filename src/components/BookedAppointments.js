import React, { useEffect, useState } from 'react';

const BookedAppointments = () => {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/appointments')
            .then(response => response.json())
            .then(data => setAppointments(data))
            .catch(error => console.error('Error fetching appointments:', error));
    }, []);

    return (
        <div>
            <h2>Booked Appointments</h2>
            {appointments.length === 0 ? (
                <p>No appointments found.</p>
            ) : (
                <ul>
                    {appointments.map(appointment => (
                        <li key={appointment.AppointmentID}>
                            <strong>Doctor:</strong> {appointment.DoctorName} <br />
                            <strong>Patient:</strong> {appointment.PatientName} <br />
                            <strong>Date:</strong> {appointment.AppointmentDate} <br />
                            <strong>Time:</strong> {appointment.AppointmentTime} <br />
                            <strong>Status:</strong> {appointment.Status}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default BookedAppointments;
