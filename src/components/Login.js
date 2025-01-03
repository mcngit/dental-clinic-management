import React, { useState } from 'react';
import '../styles/Login.css';

const Login = ({ setLoggedInUser, setCurrentPage }) => {
    const [role, setRole] = useState('Patient');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, role }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'Login successful') {
                    setLoggedInUser(data.user);
                    localStorage.setItem('loggedInUser', JSON.stringify(data.user)); // Save to localStorage
                    alert(`Welcome, ${data.user.name}!`);
                    setCurrentPage('doctorAvailability'); // Navigate to default page
                } else {
                    alert('Invalid credentials');
                }
            })
            .catch(error => console.error('Error logging in:', error));
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <div className="login-form">
                <select value={role} onChange={e => setRole(e.target.value)}>
                    <option value="Patient">Patient</option>
                    <option value="Admin">Admin</option>
                </select>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <button onClick={handleLogin}>Login</button>
            </div>
        </div>
    );
};

export default Login;
