import React, { useState, useEffect } from 'react';

const BookedAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const savedAppointments = JSON.parse(localStorage.getItem('appointments')) || [];
    setAppointments(savedAppointments);
  }, []);

  const deleteAppointment = (indexToDelete) => {
    const updatedAppointments = appointments.filter((_, index) => index !== indexToDelete);
    setAppointments(updatedAppointments);
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
  };

  const editAppointment = (indexToEdit) => {
    const appointmentToEdit = appointments[indexToEdit];
    const newDoctor = prompt('Enter new doctor:', appointmentToEdit.doctor);
    const newDate = prompt('Enter new date (YYYY-MM-DD):', appointmentToEdit.date);
    const newTime = prompt('Enter new time (HH:MM):', appointmentToEdit.time);

    if (newDoctor && newDate && newTime) {
      const updatedAppointments = [...appointments];
      updatedAppointments[indexToEdit] = { doctor: newDoctor, date: newDate, time: newTime };
      setAppointments(updatedAppointments);
      localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
    }
  };

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
              <button onClick={() => editAppointment(index)}>Edit</button>
              <button onClick={() => deleteAppointment(index)}>Cancel</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BookedAppointments;
