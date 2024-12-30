import React, { useEffect, useState } from 'react';

const BookedAppointments = ({ loggedInUser }) => {
    const [appointments, setAppointments] = useState([]);
    const [notes, setNotes] = useState({}); // Local state to manage notes input

    const [filterByDoctor, setFilterByDoctor] = useState(false);

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
            .then(data => setAppointments(data))
            .catch(error => console.error('Error fetching appointments:', error));
    }, [loggedInUser, filterByDoctor]);

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
        <div>
            <h1>Booked Appointments</h1>
            {loggedInUser.role === 'Admin' && (
                <button onClick={() => setFilterByDoctor(!filterByDoctor)}>
                    {filterByDoctor ? 'View All Appointments' : 'View My Appointments'}
                </button>
            )}
            {appointments.length === 0 ? (
                <p>No appointments found.</p>
            ) : (
                <ul>
                    {appointments.map(appointment => (
                        <li key={appointment.AppointmentID}>
                            <p>
                                <strong>Doctor:</strong> {appointment.DoctorName}
                            </p>
                            <p>
                                <strong>Patient:</strong> {appointment.PatientName}
                            </p>
                            <p>
                                <strong>Date:</strong> {appointment.AppointmentDate}
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
                                <>
                                    <button
                                        onClick={() =>
                                            handleChangeStatus(appointment.AppointmentID, 'Completed')
                                        }
                                    >
                                        Mark as Completed
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleChangeStatus(appointment.AppointmentID, 'Cancelled')
                                        }
                                    >
                                        Mark as Cancelled
                                    </button>
                                    <input
                                        type="text"
                                        placeholder="Enter a note"
                                        value={notes[appointment.AppointmentID] || ''}
                                        onChange={e =>
                                            handleNoteChange(appointment.AppointmentID, e.target.value)
                                        }
                                    />
                                    <button
                                        onClick={() => handleAddNote(appointment.AppointmentID)}
                                    >
                                        Add Note
                                    </button>
                                    <button
                                        onClick={() => handleDeleteAppointment(appointment.AppointmentID)}
                                    >
                                        Delete Appointment
                                    </button>
                                </>
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
