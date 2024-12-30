import React, { useState, useEffect } from 'react';

const Profiles = ({ loggedInUser }) => {
    const [userData, setUserData] = useState(null); // State to store user data
    const [formData, setFormData] = useState({
        phone: '',
        address: '',
        password: '',
        specialization: '',
    });

    // Fetch the latest user data from the backend
    useEffect(() => {
        if (!loggedInUser) return;

        fetch(`http://localhost:3000/profile/${loggedInUser.id}/${loggedInUser.role}`)
            .then(response => response.json())
            .then(data => {
                setUserData(data);
                setFormData({
                    phone: data.Phone || '',
                    address: data.Address || '',
                    specialization: data.Specialization || '',
                });
            })
            .catch(error => console.error('Error fetching user data:', error));
    }, [loggedInUser]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const renderAvailableDays = () => {
        if (!userData.AvailableDays) return 'N/A';
    
        const availableDays = JSON.parse(userData.AvailableDays); // Parse JSON string
    
        // Filter out days with no valid slots
        const filteredDays = availableDays.filter(dayData => dayData.slots && dayData.slots.length > 0);
    
        return filteredDays.length > 0 ? (
            filteredDays.map((dayData, index) => (
                <div key={index}>
                    <strong>{dayData.day}:</strong>
                    <ul>
                        {dayData.slots
                            .filter(slot => slot.start && slot.end) // Filter out empty slots
                            .map((slot, idx) => (
                                <li key={idx}>
                                    {slot.start} - {slot.end}
                                </li>
                            ))}
                    </ul>
                </div>
            ))
        ) : (
            <p>No available days.</p>
        );
    };
    

    // Save updated profile data to the backend
    const handleUpdate = () => {
        fetch('http://localhost:3000/profile/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: loggedInUser.id, role: loggedInUser.role, ...formData }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Profile updated successfully!');
                    // Fetch updated data from the backend
                    fetch(`http://localhost:3000/profile/${loggedInUser.id}/${loggedInUser.role}`)
                        .then(response => response.json())
                        .then(updatedData => setUserData(updatedData));
                } else {
                    alert('Error updating profile.');
                }
            })
            .catch(error => console.error('Error updating profile:', error));
    };

    if (!userData) return <p>Loading profile...</p>;

    return (
        <div>
            <h1>Your Profile</h1>

            {/* Display current user details */}
            <div>
                <h2>Current Information</h2>
                <p>
                    <strong>Name:</strong> {userData.Name}
                </p>
                <p>
                    <strong>Role:</strong> {loggedInUser.role === 'Admin' ? 'Doctor (Admin)' : 'Patient'}
                </p>
                <p>
                    <strong>Email:</strong> {userData.Email}
                </p>
                <p>
                    <strong>Phone:</strong> {userData.Phone || 'N/A'}
                </p>
                {loggedInUser.role === 'Patient' && (
                    <p>
                        <strong>Address:</strong> {userData.Address || 'N/A'}
                    </p>
                )}
                {loggedInUser.role === 'Admin' && (
                    <>
                        <p>
                            <strong>Specialization:</strong> {userData.Specialization || 'N/A'}
                        </p>
                        <div>
                            <strong>Available Days:</strong>
                            {renderAvailableDays()}
                        </div>
                    </>
                )}
            </div>

            {/* Form for updating details */}
            <div>
                <h2>Edit Your Details</h2>
                <label>
                    Phone:
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                    />
                </label>
                {loggedInUser.role === 'Patient' && (
                    <label>
                        Address:
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                        />
                    </label>
                )}
                {loggedInUser.role === 'Admin' && (
                    <label>
                        Specialization:
                        <input
                            type="text"
                            name="specialization"
                            value={formData.specialization}
                            onChange={handleInputChange}
                        />
                    </label>
                )}
                <label>
                    Password:
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter new password (optional)"
                    />
                </label>
                <button onClick={handleUpdate}>Update Profile</button>
            </div>
        </div>
    );
};

export default Profiles;
