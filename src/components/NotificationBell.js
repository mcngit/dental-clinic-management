import React, { useState, useEffect } from 'react';

const NotificationBell = ({ loggedInUser, onNavigate }) => {
    const [notificationLevel, setNotificationLevel] = useState('');

    useEffect(() => {
        if (!loggedInUser) return;
    
        fetch(`http://localhost:3000/appointments/notifications/${loggedInUser.id}/${loggedInUser.role}`)
            .then(response => response.json())
            .then(data => {
                console.log('Fetched Appointments:', data); // Debugging
                const now = new Date(); // Current date-time
                let urgent = false;
                let upcoming = false;
    
                data.forEach(appointment => {
                    // Correctly parse UTC date and time
                    const appointmentDate = new Date(appointment.AppointmentDate);
                    const [hours, minutes, seconds] = appointment.AppointmentTime.split(':').map(Number);
    
                    // Combine date and time
                    appointmentDate.setHours(hours, minutes, seconds);
    
                    console.log('Parsed Appointment Date-Time:', appointmentDate); // Debugging
    
                    const timeDiff = (appointmentDate - now) / (1000 * 60 * 60 * 24); // Difference in days
                    console.log('Time Difference (days):', timeDiff); // Debugging
    
                    if (timeDiff < 1 && timeDiff >= 0) {
                        urgent = true; // Less than 1 day
                    } else if (timeDiff < 7 && timeDiff >= 1) {
                        upcoming = true; // Between 1 and 7 days
                    }
                });
    
                console.log('Urgent:', urgent, 'Upcoming:', upcoming); // Debugging
    
                if (urgent) {
                    setNotificationLevel('red');
                } else if (upcoming) {
                    setNotificationLevel('yellow');
                } else {
                    setNotificationLevel('');
                }
            })
            .catch(error => console.error('Error fetching notifications:', error));
    }, [loggedInUser]);
    
    
       

    return (
        <div
            style={{
                position: 'relative',
                cursor: 'pointer',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: notificationLevel || 'gray',
                display: 'inline-block',
            }}
            onClick={onNavigate}
        >
            {notificationLevel && (
                <span
                    style={{
                        position: 'absolute',
                        top: '-5px',
                        right: '-5px',
                        background: 'white',
                        borderRadius: '50%',
                        width: '10px',
                        height: '10px',
                    }}
                />
            )}
        </div>
    );
};

export default NotificationBell;
