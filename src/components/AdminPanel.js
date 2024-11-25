import React, { useState, useEffect } from 'react';

const AdminPanel = () => {
  const [schedules, setSchedules] = useState({});

  useEffect(() => {
    // Load schedules from localStorage
    const savedSchedules = JSON.parse(localStorage.getItem('schedules')) || {
      'Dr. John Doe': ['10:00 AM', '11:00 AM', '2:00 PM'],
      'Dr. Jane Smith': ['12:00 PM', '1:00 PM', '3:00 PM'],
    };
    setSchedules(savedSchedules);
  }, []);

  const updateSchedule = (doctor, newTime) => {
    if (!newTime) return;
    const updatedSchedules = {
      ...schedules,
      [doctor]: [...(schedules[doctor] || []), newTime],
    };
    setSchedules(updatedSchedules);
    localStorage.setItem('schedules', JSON.stringify(updatedSchedules));
  };

  return (
    <div>
      <h2>Admin Panel</h2>
      <div>
        <h3>Manage Doctor Schedules</h3>
        {Object.keys(schedules).map((doctor, index) => (
          <div key={index}>
            <h4>{doctor}</h4>
            <ul>
              {schedules[doctor].map((time, idx) => (
                <li key={idx}>{time}</li>
              ))}
            </ul>
            <input
              type="text"
              placeholder="Add new time slot"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  updateSchedule(doctor, e.target.value);
                  e.target.value = ''; // Clear input
                }
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
