'use client'

import React from 'react';

const LoginForm = () => {
    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <form action={() => {}} className="p-4 bg-dark bg-opacity-75 rounded shadow border w-100" style={{ maxWidth: "300px" }}>
                <h2 className="text-white text-center mb-3">Login</h2>
                <div className="mb-3">
                    <input 
                        type="text" 
                        name="username" 
                        required 
                        placeholder="Username" 
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <input 
                        type="password" 
                        name="password" 
                        required 
                        placeholder="Password" 
                        className="form-control"
                    />
                </div>
                <button 
                    type="submit" 
                    className="btn btn-primary w-100"
                >
                    Login
                </button>
            </form>
        </div>
    );
};

export default LoginForm;
