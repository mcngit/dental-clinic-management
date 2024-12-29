import React, { useState } from 'react';

const AppointmentBooking = () => {
  const [doctor, setDoctor] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleBooking = () => {
    if (!doctor || !date || !time) {
      alert('Please fill in all fields.');
      return;
    }

    const newAppointment = { doctor, date, time };

    // Save appointment to localStorage
    const savedAppointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const updatedAppointments = [...savedAppointments, newAppointment];
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));

    alert('Appointment booked successfully!');
    console.log('Saved Appointments:', updatedAppointments);

    // Clear the form
    setDoctor('');
    setDate('');
    setTime('');
  };

  return (
    <div>
      <h2>Book an Appointment</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <label>
          Doctor:
          <input
            type="text"
            value={doctor}
            onChange={(e) => setDoctor(e.target.value)}
          />
        </label>
        <br />
        <label>
          Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <br />
        <label>
          Time:
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </label>
        <br />
        <button type="button" onClick={handleBooking}>
          Book Appointment
        </button>
      </form>
    </div>
  );
};

export default AppointmentBooking;
