'use client';

import React, { useState } from 'react';

const RegisterForm = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
    
        try {
            const response = await fetch('http://localhost:3000/api/auth/register',{
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.message || 'Unknown error');
            }
    
            window.location.href = '/login'; 
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <form onSubmit={handleSubmit} className="p-4 bg-dark bg-opacity-75 rounded shadow border w-100" style={{ maxWidth: "300px" }}>
                <h2 className="text-white text-center mb-3">Register</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="mb-3">
                    <input 
                        type="text" 
                        name="username" 
                        value={formData.username} 
                        onChange={handleChange} 
                        required 
                        placeholder="Username" 
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <input 
                        type="password" 
                        name="password" 
                        value={formData.password} 
                        onChange={handleChange} 
                        required 
                        placeholder="Password" 
                        className="form-control"
                    />
                </div>
                <button 
                    type="submit" 
                    className="btn btn-primary w-100"
                    disabled={loading}
                >
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );
};

export default RegisterForm;
