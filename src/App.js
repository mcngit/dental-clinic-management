import React, { useState } from 'react';
import DoctorAvailability from './components/DoctorAvailability';
import AppointmentBooking from './components/AppointmentBooking';
import BookedAppointments from './components/BookedAppointments';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';
import Signup from './components/Signup.js';

import PatientProfiles from './components/PatientProfiles';

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
      case 'PatientProfiles':
        return <PatientProfiles/>;
      case 'login':
        return <Login />;
      case 'signup':
        return <Signup />;
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
        <button
          className={currentPage === 'PatientProfiles' ? 'active' : ''}
          onClick={() => setCurrentPage('PatientProfiles')}
        >
          PatientProfiles
        </button>
        <button
          className={currentPage === 'login' ? 'active' : ''}
          onClick={() => setCurrentPage('login')}
        >
          Login
        </button>
        <button
          className={currentPage === 'signup' ? 'active' : ''}
          onClick={() => setCurrentPage('signup')}
        >
          Signup
        </button>
      </nav>
      {/* Render the Selected Page */}
      <div>{renderPage()}</div>
    </div>
  );
}

export default App;
