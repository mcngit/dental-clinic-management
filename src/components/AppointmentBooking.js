import React, { useState, useEffect } from 'react';
import '../styles/AppointmentBooking.css';

const AppointmentBooking = ({ loggedInUser }) => {
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [appointmentDate, setAppointmentDate] = useState('');
    const [availableDays, setAvailableDays] = useState([]);
    const [timeSlots, setTimeSlots] = useState([]);
    const [selectedTime, setSelectedTime] = useState('');
    const [existingAppointments, setExistingAppointments] = useState([]);

    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const weekends = ['Saturday', 'Sunday'];

    // Fetch all doctors
    useEffect(() => {
        fetch('http://localhost:3000/doctors')
            .then(response => response.json())
            .then(data => setDoctors(data))
            .catch(error => console.error('Error fetching doctors:', error));
    }, []);

    // Fetch available days for the selected doctor
    useEffect(() => {
        if (selectedDoctor) {
            const doctor = doctors.find(d => d.DoctorID === parseInt(selectedDoctor));
            if (doctor) {
                const days = JSON.parse(doctor.AvailableDays || '[]');
                console.log('Available Days:', days); // Debugging
                setAvailableDays(days);
            }
        }
    }, [selectedDoctor, doctors]);

    // Fetch existing appointments for the selected doctor and date
    useEffect(() => {
        if (selectedDoctor && appointmentDate) {
            fetch(`http://localhost:3000/appointments/${selectedDoctor}/${appointmentDate}`)
                .then(response => response.json())
                .then(data => {
                    console.log('Fetched Appointments:', data); // Debugging
                    setExistingAppointments(data);
                })
                .catch(error => console.error('Error fetching existing appointments:', error));
        } else {
            setExistingAppointments([]);
        }
    }, [selectedDoctor, appointmentDate]);

    // Generate time slots based on availability and booked slots
    useEffect(() => {
        if (!appointmentDate || !availableDays) {
            setTimeSlots([]);
            return;
        }

        const dayOfWeek = new Date(appointmentDate).toLocaleString('en-US', { weekday: 'long' });
        console.log('Day of Week:', dayOfWeek);

        const specificDayAvailability = availableDays.find(day => day.day === dayOfWeek);
        const isWeekday = weekdays.includes(dayOfWeek);
        const isWeekend = weekends.includes(dayOfWeek);

        const generalAvailability = availableDays.find(day =>
            isWeekday ? day.day === 'Weekdays' : day.day === 'Weekends'
        );

        const allSlots = [];
        if (specificDayAvailability) {
            allSlots.push(...specificDayAvailability.slots);
        }
        if (generalAvailability && !specificDayAvailability) {
            allSlots.push(...generalAvailability.slots);
        }

        console.log('All Slots:', allSlots);

        const slots = [];
        allSlots.forEach(({ start, end }) => {
            if (!start || !end) {
                console.warn('Invalid Slot:', { start, end });
                return;
            }

            const [startHours, startMinutes] = start.split(':').map(Number);
            const [endHours, endMinutes] = end.split(':').map(Number);

            let current = new Date(0, 0, 0, startHours, startMinutes);
            const endTime = new Date(0, 0, 0, endHours, endMinutes);

            while (current < endTime) {
                const hours = current.getHours().toString().padStart(2, '0');
                const minutes = current.getMinutes().toString().padStart(2, '0');
                slots.push(`${hours}:${minutes}`);
                current.setMinutes(current.getMinutes() + 30); // Increment by 30 minutes
            }
        });

        console.log('Generated Slots:', slots);

        const bookedSlots = existingAppointments.map(app =>
            app.AppointmentTime.slice(0, 5) // Ensure `HH:mm` format
        );
        console.log('Booked Slots:', bookedSlots);

        const updatedSlots = slots.map(slot => ({
            time: slot,
            available: !bookedSlots.includes(slot), // Check if slot is booked
        }));
        console.log('Updated Slots:', updatedSlots);

        setTimeSlots(updatedSlots);
    }, [appointmentDate, availableDays, existingAppointments]);

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
                    setSelectedDoctor('');
                    setAppointmentDate('');
                    setSelectedTime('');
                } else {
                    alert(data.message || 'Error booking appointment.');
                }
            })
            .catch(error => console.error('Error booking appointment:', error));
    };

    return (
        <div className="booking-container">
            <h1>Book Appointment</h1>
            <div className="booking-form">
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
                {availableDays.length > 0 && (
                    <div className="available-days">
                        <h3>Available Days</h3>
                        <ul>
                            {availableDays.map((day, index) => (
                                <li key={index}>
                                    <strong>{day.day}:</strong>{' '}
                                    {day.slots.map(slot => `${slot.start} - ${slot.end}`).join(', ')}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                <label>
                    Select Date:
                    <input
                        type="date"
                        value={appointmentDate}
                        onChange={e => setAppointmentDate(e.target.value)}
                    />
                </label>
                <label>
                    Select Time:
                    <select
                        value={selectedTime}
                        onChange={e => setSelectedTime(e.target.value)}
                    >
                        <option value="">--Select a Time Slot--</option>
                        {timeSlots.map((slot, index) => (
                            <option
                                key={index}
                                value={slot.time}
                                disabled={!slot.available}
                                className={`time-slot ${slot.available ? 'available' : 'booked'}`}
                            >
                                {slot.time} {slot.available ? '' : '(Booked)'}
                            </option>
                        ))}
                    </select>
                </label>
                <button onClick={handleBookAppointment}>Book Appointment</button>
            </div>
        </div>
    );
};

export default AppointmentBooking;