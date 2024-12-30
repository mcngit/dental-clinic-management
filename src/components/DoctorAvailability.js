import React, { useEffect, useState } from 'react';

const DoctorsPage = () => {
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/doctors')
            .then(response => response.json())
            .then(data => setDoctors(data))
            .catch(error => console.error('Error fetching doctors:', error));
    }, []);

    const parseAvailability = (availableDays) => {
        if (!availableDays) return null;
        try {
            return JSON.parse(availableDays); // Parse JSON array
        } catch (error) {
            console.error('Error parsing available days:', error);
            return null;
        }
    };

    return (
        <div>
            <h1>Doctors</h1>
            <ul>
                {doctors.map(doctor => {
                    const availability = parseAvailability(doctor.AvailableDays);
                    return (
                        <li key={doctor.DoctorID}>
                            <h2>{doctor.Name}</h2>
                            <p>Specialization: {doctor.Specialization}</p>
                            <p>Email: {doctor.Email}</p>
                            <p>Phone: {doctor.Phone}</p>
                            <div>
                                <h3>Availability:</h3>
                                {availability ? (
                                    availability.map((item, index) => (
                                        <div key={index}>
                                            <strong>{item.day}:</strong>
                                            <ul>
                                                {item.slots && item.slots.length > 0 ? (
                                                    item.slots.map((slot, idx) =>
                                                        slot.start && slot.end ? (
                                                            <li key={idx}>
                                                                {slot.start} - {slot.end}
                                                            </li>
                                                        ) : null
                                                    )
                                                ) : (
                                                    <li>No slots available</li>
                                                )}
                                            </ul>
                                        </div>
                                    ))
                                ) : (
                                    <p>No availability set.</p>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default DoctorsPage;
