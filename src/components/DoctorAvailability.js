import React from 'react';

const DoctorAvailability = () => {
  const doctors = [
    { name: 'Dr. John Doe', available: '10:00 AM - 3:00 PM' },
    { name: 'Dr. Jane Smith', available: '12:00 PM - 5:00 PM' },
  ];

  return (
    <div>
      <h2>Doctor Availability</h2>
      <ul>
        {doctors.map((doctor, index) => (
          <li key={index}>
            <strong>{doctor.name}</strong>: {doctor.available}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DoctorAvailability;
