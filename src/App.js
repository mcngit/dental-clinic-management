import React, { useState } from 'react';
import DoctorAvailability from './components/DoctorAvailability';
import AppointmentBooking from './components/AppointmentBooking';
import BookedAppointments from './components/BookedAppointments';
import AdminPanel from './components/AdminPanel';

function App() {
  const [currentPage, setCurrentPage] = useState('doctorAvailability'); // Default page

  const renderPage = () => {
    switch (currentPage) {
      case 'doctorAvailability':
        return <DoctorAvailability />;
      case 'appointmentBooking':
        return <AppointmentBooking />;
      case 'bookedAppointments':
        return <BookedAppointments />;
      case 'adminPanel':
        return <AdminPanel />;
      default:
        return <DoctorAvailability />;
    }
  };

  return (
    <div className="App">
      <h1>Dental Clinic Management</h1>
      {/* Navigation Menu */}
      <nav>
        <button
          className={currentPage === 'doctorAvailability' ? 'active' : ''}
          onClick={() => setCurrentPage('doctorAvailability')}
        >
          Doctor Availability
        </button>
        <button
          className={currentPage === 'appointmentBooking' ? 'active' : ''}
          onClick={() => setCurrentPage('appointmentBooking')}
        >
          Book Appointment
        </button>
        <button
          className={currentPage === 'bookedAppointments' ? 'active' : ''}
          onClick={() => setCurrentPage('bookedAppointments')}
        >
          Booked Appointments
        </button>
        <button
          className={currentPage === 'adminPanel' ? 'active' : ''}
          onClick={() => setCurrentPage('adminPanel')}
        >
          Admin Panel
        </button>
      </nav>
      {/* Render the Selected Page */}
      <div>{renderPage()}</div>
    </div>
  );
}

export default App;
