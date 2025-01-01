import React, { useEffect, useState } from 'react';
import "../styles/BookedAppointments.css";

const BookedAppointments = ({ loggedInUser }) => {
    const [appointments, setAppointments] = useState([]);
    const [notes, setNotes] = useState({}); // Local state to manage notes input
    const [filterByDoctor, setFilterByDoctor] = useState(false);
    const [urgentCount, setUrgentCount] = useState(0);
    const [upcomingCount, setUpcomingCount] = useState(0);

    useEffect(() => {
        if (!loggedInUser) return;

        const endpoint =
            loggedInUser.role === 'Admin'
                ? filterByDoctor
                    ? `http://localhost:3000/appointments/doctor/${loggedInUser.id}`
                    : 'http://localhost:3000/appointments/all'
                : `http://localhost:3000/appointments/patient/${loggedInUser.id}`;

        fetch(endpoint)
            .then(response => response.json())
            .then(data => {
                setAppointments(data);
                calculateUrgency(data); // Determine urgency levels
            })
            .catch(error => console.error('Error fetching appointments:', error));
    }, [loggedInUser, filterByDoctor]);

    const calculateUrgency = (appointments) => {
        const now = new Date();
        let urgent = 0;
        let upcoming = 0;

        appointments.forEach(appointment => {
            const appointmentDate = new Date(appointment.AppointmentDate);
            const [hours, minutes, seconds] = appointment.AppointmentTime.split(':').map(Number);
            appointmentDate.setHours(hours, minutes, seconds);

            const timeDiff = (appointmentDate - now) / (1000 * 60 * 60 * 24); // Difference in days

            if (timeDiff < 1 && timeDiff >= 0) {
                urgent++;
            } else if (timeDiff < 7 && timeDiff >= 1) {
                upcoming++;
            }
        });

        setUrgentCount(urgent);
        setUpcomingCount(upcoming);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        date.setDate(date.getDate()); // Correct for the date offset
        return `${date.getDate().toString().padStart(2, '0')}-${
            (date.getMonth() + 1).toString().padStart(2, '0')
        }-${date.getFullYear()}`;
    };

    const handleChangeStatus = (appointmentId, newStatus) => {
        fetch(`http://localhost:3000/appointments/status`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ appointmentId, newStatus }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Status updated successfully!');
                    setAppointments(prev =>
                        prev.map(appointment =>
                            appointment.AppointmentID === appointmentId
                                ? { ...appointment, Status: newStatus }
                                : appointment
                        )
                    );
                } else {
                    alert('Error updating status.');
                }
            })
            .catch(error => console.error('Error updating status:', error));
    };

    const handleDeleteAppointment = (appointmentId) => {
        fetch(`http://localhost:3000/appointments/delete/${appointmentId}`, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Appointment deleted successfully!');
                    setAppointments(prev => prev.filter(a => a.AppointmentID !== appointmentId));
                } else {
                    alert('Error deleting appointment.');
                }
            })
            .catch(error => console.error('Error deleting appointment:', error));
    };

    const handleAddNote = (appointmentId) => {
        const note = notes[appointmentId];
        if (!note) {
            alert('Please enter a note.');
            return;
        }

        fetch(`http://localhost:3000/appointments/note`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ appointmentId, note }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Note added successfully!');
                    setAppointments(prev =>
                        prev.map(appointment =>
                            appointment.AppointmentID === appointmentId
                                ? { ...appointment, Notes: note }
                                : appointment
                        )
                    );
                    setNotes(prev => ({ ...prev, [appointmentId]: '' })); // Clear the input
                } else {
                    alert('Error adding note.');
                }
            })
            .catch(error => console.error('Error adding note:', error));
    };

    const handleNoteChange = (appointmentId, value) => {
        setNotes(prev => ({ ...prev, [appointmentId]: value }));
    };

    return (
        <div className="booked-appointments-container">
            <h1>Booked Appointments</h1>
            {urgentCount > 0 && (
                <p className="urgent-notification">
                    {urgentCount} urgent appointment{urgentCount > 1 ? 's' : ''}
                </p>
            )}
            {upcomingCount > 0 && (
                <p className="upcoming-notification">
                    {upcomingCount} upcoming appointment{upcomingCount > 1 ? 's' : ''}
                </p>
            )}
            {loggedInUser.role === 'Admin' && (
                <button
                    className="filter-button"
                    onClick={() => setFilterByDoctor(!filterByDoctor)}
                >
                    {filterByDoctor ? 'View All Appointments' : 'View My Appointments'}
                </button>
            )}
            {appointments.length === 0 ? (
                <p className="no-appointments-message">No appointments found.</p>
            ) : (
                <ul className="appointment-list">
                    {appointments.map(appointment => (
                        <li key={appointment.AppointmentID} className="appointment-item">
                            <p>
                                <strong>Doctor:</strong> {appointment.DoctorName}
                            </p>
                            <p>
                                <strong>Patient:</strong> {appointment.PatientName}
                            </p>
                            <p>
                                <strong>Date:</strong> {formatDate(appointment.AppointmentDate)}
                            </p>
                            <p>
                                <strong>Time:</strong> {appointment.AppointmentTime}
                            </p>
                            <p>
                                <strong>Status:</strong> {appointment.Status}
                            </p>
                            <p>
                                <strong>Notes:</strong> {appointment.Notes || 'No notes yet'}
                            </p>
                            {loggedInUser.role === 'Admin' && (
                                <div className="appointment-buttons">
                                    <button onClick={() => handleChangeStatus(appointment.AppointmentID, 'Completed')}>
                                        Mark as Completed
                                    </button>
                                    <button onClick={() => handleChangeStatus(appointment.AppointmentID, 'Cancelled')}>
                                        Mark as Cancelled
                                    </button>
                                    <input
                                        type="text"
                                        placeholder="Enter a note"
                                        className="note-input"
                                        value={notes[appointment.AppointmentID] || ''}
                                        onChange={e => handleNoteChange(appointment.AppointmentID, e.target.value)}
                                    />
                                    <button onClick={() => handleAddNote(appointment.AppointmentID)}>
                                        Add Note
                                    </button>
                                    <button onClick={() => handleDeleteAppointment(appointment.AppointmentID)}>
                                        Delete Appointment
                                    </button>
                                </div>
                            )}
                            {loggedInUser.role !== 'Admin' && appointment.Status !== 'Cancelled' && (
                                <button
                                    onClick={() =>
                                        handleChangeStatus(appointment.AppointmentID, 'Cancelled')
                                    }
                                >
                                    Cancel Appointment
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default BookedAppointments;
