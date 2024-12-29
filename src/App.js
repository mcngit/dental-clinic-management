import React, { useState, useEffect } from 'react';
import DoctorAvailability from './components/DoctorAvailability';
import AppointmentBooking from './components/AppointmentBooking';
import BookedAppointments from './components/BookedAppointments';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';
import Signup from './components/Signup';
import PatientProfiles from './components/PatientProfiles';
import Profiles from './components/Profiles';

function App() {
    const [currentPage, setCurrentPage] = useState('doctorAvailability'); // Default page
    const [loggedInUser, setLoggedInUser] = useState(null); // Store logged-in user info

    // Restore logged-in user from localStorage
    useEffect(() => {
        const savedUser = localStorage.getItem('loggedInUser');
        if (savedUser) {
            setLoggedInUser(JSON.parse(savedUser));
        }
    }, []);

    const logout = () => {
        setLoggedInUser(null); // Clear the logged-in user state
        localStorage.removeItem('loggedInUser'); // Clear from localStorage
        setCurrentPage('login'); // Redirect to the login page
    };

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
                return loggedInUser && loggedInUser.role === 'Admin' ? (
                    <PatientProfiles loggedInUser={loggedInUser} />
                ) : (
                    <div>
                        <h2>Access Denied</h2>
                        <p>You do not have permission to view this page.</p>
                    </div>
                );
            case 'login':
                return <Login setLoggedInUser={setLoggedInUser} setCurrentPage={setCurrentPage} />;
            case 'signup':
                return <Signup />;
            case 'profiles':
                return <Profiles loggedInUser={loggedInUser} />;
            default:
                return <DoctorAvailability />;
        }
    };

    return (
        <div className="App">
            <header>
                <h1>Dental Clinic Management</h1>
                {loggedInUser ? (
                    <div>
                        <p>Welcome, {loggedInUser.name}!</p>
                        <button onClick={logout}>Logout</button>
                    </div>
                ) : (
                    <p>Please log in.</p>
                )}
            </header>
            {/* Navigation Menu */}
            <nav>
    {loggedInUser && (
        <>
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
                className={currentPage === 'profiles' ? 'active' : ''}
                onClick={() => setCurrentPage('profiles')}
            >
                Profile
            </button>
            {loggedInUser.role === 'Admin' && (
                <button
                    className={currentPage === 'PatientProfiles' ? 'active' : ''}
                    onClick={() => setCurrentPage('PatientProfiles')}
                >
                    Patient Profiles
                </button>
              )}
              {loggedInUser.role === 'Admin' && (
                <button
                    className={currentPage === 'adminPanel' ? 'active' : ''}
                    onClick={() => setCurrentPage('adminPanel')}
                >
                    Admin Panel
                </button>
            )}
        </>
    )}
    {!loggedInUser && (
        <>
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
        </>
    )}
</nav>

            {/* Render the Selected Page */}
            <div>{renderPage()}</div>
        </div>
    );
}

export default App;
