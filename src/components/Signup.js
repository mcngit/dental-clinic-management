import React, { useState } from 'react';

const SignUp = () => {
    const [role, setRole] = useState('Patient'); // Default role is Patient
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '', // For Patients
        specialization: '', // For Admins
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSignUp = () => {
        if (role === 'Patient' && !formData.address) {
            alert('Address is required for Patients.');
            return;
        }
        if (role === 'Admin' && !formData.specialization) {
            alert('Specialization is required for Admins.');
            return;
        }
    
        const endpoint = role === 'Admin' ? '/signup/doctor' : '/signup/patient';
    
        fetch(`http://localhost:3000${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(`${role} signed up successfully!`);
                } else {
                    alert(data.message || 'Error signing up. Please try again.');
                }
            })
            .catch(error => console.error('Error during signup:', error));
    };

    return (
        <div>
            <h2>Sign Up</h2>
            <label>
                Select Role:
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="Patient">Patient</option>
                    <option value="Admin">Admin</option>
                </select>
            </label>
            <div>
                <label>
                    Name:
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                </label>
            </div>
            <div>
                <label>
                    Email:
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                </label>
            </div>
            <div>
                <label>
                    Password:
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />
                </label>
            </div>
            <div>
                <label>
                    Phone:
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                    />
                </label>
            </div>

            {role === 'Patient' && (
                <div>
                    <label>
                        Address:
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                </div>
            )}

            {role === 'Admin' && (
                <div>
                    <label>
                        Specialization:
                        <input
                            type="text"
                            name="specialization"
                            value={formData.specialization}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                </div>
            )}

            <button onClick={handleSignUp}>Sign Up</button>
        </div>
    );
};

export default SignUp;
