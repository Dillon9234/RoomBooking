'use client'

import React from 'react'

const LoginForm = () => {

    return (
        <div className="flex items-center justify-center min-h-screen mt-[-10vh]">
            <form action={() => {}} className="flex flex-col gap-3 w-64 p-6 bg-black bg-opacity-60 rounded-2xl shadow-lg border">
                <h2 className="text-white text-lg font-semibold text-center">Login</h2>
                <input 
                    type="text" 
                    name="username" 
                    required 
                    placeholder="Username" 
                    className="w-full p-2 rounded-md text-black focus:outline-none"
                />
                <input 
                    type="password" 
                    name="password" 
                    required 
                    placeholder="Password" 
                    className="w-full p-2 rounded-md text-black focus:outline-none"
                />
                <button 
                    type="submit" 
                    className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
                >
                    Login
                </button>
            </form>
        </div>
    )
}

export default LoginForm
