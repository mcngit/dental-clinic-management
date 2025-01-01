import React, { useState, useEffect } from 'react';
import "../styles/NotificationBell.css"

const NotificationBell = ({ loggedInUser, onNavigate }) => {
    const [urgentCount, setUrgentCount] = useState(0);
    const [upcomingCount, setUpcomingCount] = useState(0);

    useEffect(() => {
        if (!loggedInUser) return;

        fetch(`http://localhost:3000/appointments/notifications/${loggedInUser.id}/${loggedInUser.role}`)
            .then(response => response.json())
            .then(data => {
                const now = new Date();
                let urgent = 0;
                let upcoming = 0;

                data.forEach(appointment => {
                    const appointmentDate = new Date(appointment.AppointmentDate);
                    const [hours, minutes, seconds] = appointment.AppointmentTime.split(':').map(Number);
                    appointmentDate.setHours(hours, minutes, seconds);

                    const timeDiff = (appointmentDate - now) / (1000 * 60 * 60 * 24);

                    if (timeDiff < 1 && timeDiff >= 0) {
                        urgent++;
                    } else if (timeDiff < 7 && timeDiff >= 1) {
                        upcoming++;
                    }
                });

                setUrgentCount(urgent);
                setUpcomingCount(upcoming);
            })
            .catch(error => console.error('Error fetching notifications:', error));
    }, [loggedInUser]);

    const totalNotifications = urgentCount + upcomingCount;
    return (
        <div>
            <div
                style={{
                    position: 'relative',
                    cursor: 'pointer',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: totalNotifications > 0 ? (urgentCount > 0 ? 'red' : 'yellow') : 'gray',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
                }}
                onClick={onNavigate}
            >{totalNotifications > 0 ? totalNotifications : ''}
            </div>
        </div>
    );
};

export default NotificationBell;
