import React, { useState, useEffect } from 'react';
import DoctorAvailability from './components/DoctorAvailability';
import AppointmentBooking from './components/AppointmentBooking';
import BookedAppointments from './components/BookedAppointments';
import Login from './components/Login';
import Signup from './components/Signup';
import PatientProfiles from './components/PatientProfiles';
import Profiles from './components/Profiles';
import DoctorDayHourSelector from './components/DoctorDayHourSelector';
import NotificationBell from './components/NotificationBell';
import HomePage from './components/HomePage.js';

function App() {
    const [currentPage, setCurrentPage] = useState('home'); // Default page
    const [loggedInUser, setLoggedInUser] = useState(null); // Store logged-in user info

    // Restore logged-in user from localStorage
    useEffect(() => {
        // Add an event listener to clear localStorage on browser close
        const handleBeforeUnload = () => {
            localStorage.removeItem('loggedInUser');
        };
    
        window.addEventListener('beforeunload', handleBeforeUnload);
    
        // Clean up the event listener
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    const logout = () => {
        setLoggedInUser(null); // Clear the logged-in user state
        localStorage.removeItem('loggedInUser'); // Clear from localStorage
        setCurrentPage('login'); // Redirect to the login page
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return <HomePage />;
            case 'doctorAvailability':
                return <DoctorAvailability />;
            case 'appointmentBooking':
                return <AppointmentBooking loggedInUser={loggedInUser} />;
            case 'bookedAppointments':
                return <BookedAppointments loggedInUser={loggedInUser} />;
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
            case 'doctorDayHourSelector':
                return <DoctorDayHourSelector loggedInUser={loggedInUser} />;
            default:
                return <DoctorAvailability />;
        }
    };

    return (
        <div className="App">
            <header>
                <h1>Dental Clinic Management</h1>
                {loggedInUser ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <p>Welcome, {loggedInUser.name}!</p>
                        <NotificationBell loggedInUser={loggedInUser} onNavigate={() => setCurrentPage('bookedAppointments')} />
                        <button onClick={logout}>Logout</button>
                    </div>
                ) : (
                    <p>Please log in.</p>
                )}
            </header>
            {/* Navigation Menu */}
            <nav>
            <button
                className={currentPage === 'home' ? 'active' : ''}
                onClick={() => setCurrentPage('home')}
            >
                Home
            </button>
            <button
                className={currentPage === 'doctorAvailability' ? 'active' : ''}
                onClick={() => setCurrentPage('doctorAvailability')}
            >
                Doctor Availability
            </button>
    {loggedInUser && (
        <>
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
                    className={currentPage === 'doctorDayHourSelector' ? 'active' : ''}
                    onClick={() => setCurrentPage('doctorDayHourSelector')}
                >
                    Set Doctor Availability
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
