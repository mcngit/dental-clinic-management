import React, { useState, useEffect } from 'react';

const BookedAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    // Load appointments from localStorage
    const savedAppointments = JSON.parse(localStorage.getItem('appointments')) || [];
    setAppointments(savedAppointments);
  }, []);

  return (
    <div>
      <h2>Booked Appointments</h2>
      {appointments.length === 0 ? (
        <p>No appointments booked yet.</p>
      ) : (
        <ul>
          {appointments.map((appointment, index) => (
            <li key={index}>
              <strong>{appointment.doctor}</strong>: {appointment.date} at {appointment.time}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BookedAppointments;
