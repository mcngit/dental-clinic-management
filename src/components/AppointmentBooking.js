import React, { useState, useEffect } from 'react';

const BookAppointment = ({ loggedInUser }) => {
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [availableSlots, setAvailableSlots] = useState([]);
    const [appointmentDate, setAppointmentDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');

    // Fetch doctors from the backend
    useEffect(() => {
        fetch('http://localhost:3000/doctors')
            .then(response => response.json())
            .then(data => setDoctors(data))
            .catch(error => console.error('Error fetching doctors:', error));
    }, []);

    // Update available slots when a doctor is selected
    useEffect(() => {
        if (selectedDoctor) {
            const doctor = doctors.find(d => d.DoctorID === parseInt(selectedDoctor));
            if (doctor) {
                const slots = JSON.parse(doctor.AvailableSlots || '[]');
                setAvailableSlots(slots);
            }
        } else {
            setAvailableSlots([]);
        }
    }, [selectedDoctor, doctors]);

    // Handle booking an appointment
    const handleBookAppointment = () => {
        if (!selectedDoctor || !appointmentDate || !selectedTime) {
            alert('Please fill in all fields.');
            return;
        }

        fetch('http://localhost:3000/appointments/book', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                patientId: loggedInUser.id,
                doctorId: selectedDoctor,
                date: appointmentDate,
                time: selectedTime,
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Appointment booked successfully!');
                } else {
                    alert(data.message || 'Error booking appointment.');
                }
            })
            .catch(error => console.error('Error booking appointment:', error));
    };

    // Generate 30-minute time slots
    const generateTimeSlots = () => {
        if (!availableSlots.length) return [];
        const slots = [];
        availableSlots.forEach(range => {
            const [start, end] = range.split('-').map(time => {
                const [hours, minutes] = time.split(':').map(Number);
                return new Date(0, 0, 0, hours, minutes); // Create a Date object for easy manipulation
            });

            let current = start;
            while (current < end) {
                const hours = current.getHours().toString().padStart(2, '0');
                const minutes = current.getMinutes().toString().padStart(2, '0');
                slots.push(`${hours}:${minutes}`);
                current.setMinutes(current.getMinutes() + 30); // Increment by 30 minutes
            }
        });
        return slots;
    };

    const timeSlots = generateTimeSlots();

    return (
        <div>
            <h1>Book Appointment</h1>
            <label>
                Select Doctor:
                <select
                    value={selectedDoctor}
                    onChange={e => setSelectedDoctor(e.target.value)}
                >
                    <option value="">--Select a Doctor--</option>
                    {doctors.map(doctor => (
                        <option key={doctor.DoctorID} value={doctor.DoctorID}>
                            {doctor.Name} ({doctor.Specialization || 'N/A'})
                        </option>
                    ))}
                </select>
            </label>
            <br />
            <label>
                Select Date:
                <input
                    type="date"
                    value={appointmentDate}
                    onChange={e => setAppointmentDate(e.target.value)}
                />
            </label>
            <br />
            <label>
                Select Time:
                <select
                    value={selectedTime}
                    onChange={e => setSelectedTime(e.target.value)}
                >
                    <option value="">--Select a Time Slot--</option>
                    {timeSlots.map((time, index) => (
                        <option key={index} value={time}>
                            {time}
                        </option>
                    ))}
                </select>
            </label>
            <br />
            <button onClick={handleBookAppointment}>Book Appointment</button>
        </div>
    );
};

export default BookAppointment;
