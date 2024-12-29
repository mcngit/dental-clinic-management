import React, { useEffect, useState } from 'react';

const DoctorsPage = () => {
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/doctors')
            .then(response => response.json())
            .then(data => setDoctors(data))
            .catch(error => console.error('Error fetching doctors:', error));
    }, []);

    return (
        <div>
            <h1>Doctors</h1>
            <ul>
                {doctors.map(doctor => (
                    <li key={doctor.DoctorID}>
                        <h2>{doctor.Name}</h2>
                        <p>Specialization: {doctor.Specialization}</p>
                        <p>Email: {doctor.Email}</p>
                        <p>Phone: {doctor.Phone}</p>
                        <p>Available Slots: {doctor.AvailableSlots}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DoctorsPage;
