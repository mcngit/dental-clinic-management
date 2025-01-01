import React, { useState, useEffect } from 'react';
import "../styles/DoctorDayHourSelector.css";

const DoctorDayHourSelector = ({ loggedInUser }) => {
    const [availability, setAvailability] = useState([]);
    const [errors, setErrors] = useState([]); // Track errors for invalid slots

    const daysOfWeek = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
        'Weekdays',
        'Weekends',
    ];

    const generateTimeOptions = () => {
        const options = [];
        for (let h = 0; h < 24; h++) {
            for (let m = 0; m < 60; m += 30) {
                const time = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
                options.push(time);
            }
        }
        return options;
    };

    const timeOptions = generateTimeOptions();

    useEffect(() => {
        fetch(`http://localhost:3000/doctors/availability/${loggedInUser.id}`)
            .then(response => response.json())
            .then(data => {
                if (data.availability) {
                    setAvailability(data.availability);
                }
            })
            .catch(error => console.error('Error fetching availability:', error));
    }, [loggedInUser]);

    const handleDayChange = (index, value) => {
        const updatedAvailability = [...availability];
        updatedAvailability[index].day = value;
        setAvailability(updatedAvailability);
    };

    const handleSlotChange = (dayIndex, slotIndex, field, value) => {
        const updatedAvailability = [...availability];
        updatedAvailability[dayIndex].slots[slotIndex][field] = value;

        // Validate the slot
        validateSlots(updatedAvailability);

        // Add a new slot if both start and end are filled
        if (
            updatedAvailability[dayIndex].slots[slotIndex].start &&
            updatedAvailability[dayIndex].slots[slotIndex].end &&
            slotIndex === updatedAvailability[dayIndex].slots.length - 1
        ) {
            updatedAvailability[dayIndex].slots.push({ start: '', end: '' });
        }
        setAvailability(updatedAvailability);
    };

    const addNewDay = () => {
        setAvailability([...availability, { day: '', slots: [{ start: '', end: '' }] }]);
    };

    const validateSlots = (availabilityToValidate) => {
        const validationErrors = [];
        availabilityToValidate.forEach((item, dayIndex) => {
            item.slots.forEach((slot, slotIndex) => {
                if (slot.start && slot.end && slot.start >= slot.end) {
                    validationErrors.push({
                        dayIndex,
                        slotIndex,
                        message: `Start time (${slot.start}) must be earlier than end time (${slot.end})`,
                    });
                }
            });
        });
        setErrors(validationErrors);
    };

    const saveAvailability = () => {
        const validAvailability = availability.map(day => ({
            ...day,
            slots: day.slots.filter(slot => slot.start && slot.end), // Remove invalid slots
        })).filter(day => day.slots.length > 0); // Remove days without valid slots
    
        fetch('http://localhost:3000/doctors/availability', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ doctorId: loggedInUser.id, availability: validAvailability }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Availability saved successfully!');
                } else {
                    alert('Error saving availability.');
                }
            })
            .catch(error => console.error('Error saving availability:', error));
    };

    return (
        <div className="doctor-day-hour-container">
            <h1>Set Availability</h1>
            {availability.map((item, dayIndex) => (
                <div key={dayIndex} className="availability-section">
                    <label>
                        Select Day:
                        <select
                            value={item.day}
                            onChange={e => handleDayChange(dayIndex, e.target.value)}
                        >
                            <option value="">--Select Day--</option>
                            {daysOfWeek.map(day => (
                                <option key={day} value={day}>
                                    {day}
                                </option>
                            ))}
                        </select>
                    </label>
                    {item.slots.map((slot, slotIndex) => (
                        <div key={slotIndex} className="slot-section">
                            <label>
                                Start Time:
                                <select
                                    value={slot.start}
                                    onChange={e =>
                                        handleSlotChange(dayIndex, slotIndex, 'start', e.target.value)
                                    }
                                >
                                    <option value="">Select Start Time</option>
                                    {timeOptions.map(time => (
                                        <option key={time} value={time}>
                                            {time}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                End Time:
                                <select
                                    value={slot.end}
                                    onChange={e =>
                                        handleSlotChange(dayIndex, slotIndex, 'end', e.target.value)
                                    }
                                >
                                    <option value="">Select End Time</option>
                                    {timeOptions.map(time => (
                                        <option key={time} value={time}>
                                            {time}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            {errors.some(
                                error =>
                                    error.dayIndex === dayIndex && error.slotIndex === slotIndex
                            ) && (
                                <p>
                                    {
                                        errors.find(
                                            error =>
                                                error.dayIndex === dayIndex &&
                                                error.slotIndex === slotIndex
                                        ).message
                                    }
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            ))}
            <div className="action-buttons">
                <button onClick={addNewDay}>Add Another Day</button>
                <button onClick={saveAvailability}>Save Availability</button>
            </div>
        </div>
    );
};

export default DoctorDayHourSelector;
