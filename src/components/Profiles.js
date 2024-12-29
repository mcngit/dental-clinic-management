import React, { useState } from 'react';

const Profiles = ({ loggedInUser, setLoggedInUser }) => {
    // Initialize form data for editing
    const [formData, setFormData] = useState({
        phone: loggedInUser?.phone || '',
        address: loggedInUser?.address || '',
        password: '',
        specialization: loggedInUser?.specialization || '',
        availableSlots: loggedInUser?.availableSlots || '',
    });

    // Handle input changes for form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle profile update
    const handleUpdate = () => {
        fetch(`http://localhost:3000/profile/update`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...formData, id: loggedInUser.id, role: loggedInUser.role }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Profile updated successfully!');
                    // Update logged-in user details
                    setLoggedInUser({ ...loggedInUser, ...formData });
                } else {
                    alert('Error updating profile.');
                }
            })
            .catch(error => console.error('Error updating profile:', error));
    };

    return (
        <div>
            <h1>Your Profile</h1>

            {/* View-only current details */}
            <div>
                <h2>Current Information</h2>
                <p>
                    <strong>Name:</strong> {loggedInUser.name}
                </p>
                <p>
                    <strong>Role:</strong> {loggedInUser.role === 'Admin' ? 'Doctor (Admin)' : 'Patient'}
                </p>
                <p>
                    <strong>Email:</strong> {loggedInUser.email}
                </p>
                <p>
                    <strong>Phone:</strong> {loggedInUser.phone || 'N/A'}
                </p>
                {loggedInUser.role === 'Patient' && (
                    <p>
                        <strong>Address:</strong> {loggedInUser.address || 'N/A'}
                    </p>
                )}
                {loggedInUser.role === 'Admin' && (
                    <>
                        <p>
                            <strong>Specialization:</strong> {loggedInUser.specialization || 'N/A'}
                        </p>
                        <p>
                            <strong>Available Slots:</strong>{' '}
                            {loggedInUser.availableSlots
                                ? JSON.parse(loggedInUser.availableSlots).join(', ')
                                : 'N/A'}
                        </p>
                    </>
                )}
            </div>

            {/* Editable fields */}
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
                    <>
                        <label>
                            Specialization:
                            <input
                                type="text"
                                name="specialization"
                                value={formData.specialization}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Available Slots:
                            <textarea
                                name="availableSlots"
                                value={formData.availableSlots}
                                onChange={handleInputChange}
                            />
                        </label>
                    </>
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
