'use client'

import React, { useState } from 'react'
import ToastMessage from './ToastMessage';
import { useRouter } from 'next/navigation';

const LoginForm = () => {

    const router = useRouter()

    const [toast, setToast] = useState<{
        text: string;
        type: "success" | "error";
      } | null>(null);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const username = formData.get('username') as string;
        const password = formData.get('password') as string;

        const showToast = (message: string, type: "success" | "error") => {
            setToast({ text: message, type });
          };
    
        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ username, password }),
          });
    
          if (res.ok) {
            showToast("Login Successful","success")
            router.push('/');
          } else {
            showToast("Login Failed","error")
          }
        } catch (error) {
          showToast("Something went wrong","error")
        }
      };

    return (
        <div className="flex items-center justify-center min-h-screen mt-[-10vh]">
            <form onSubmit={handleLogin} className="flex flex-col gap-3 w-64 p-6 bg-black bg-opacity-60 rounded-2xl shadow-lg border">
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
            {toast && (
                <ToastMessage
                text={toast.text}
                type={toast.type}
                onClose={() => setToast(null)}
                />
            )}
        </div>
    )
}

export default LoginForm
