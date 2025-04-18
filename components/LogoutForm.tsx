"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import ToastMessage from "./ToastMessage";

const LogoutForm = () => {

    const [isPending, setIsPending] = useState(false)
    const router = useRouter()

    const [toast, setToast] = useState<{
        text: string;
        type: "success" | "error";
      } | null>(null);

    const showToast = (message: string, type: "success" | "error") => {
        setToast({ text: message, type });
    };

    const handleLogout = async () => {
        setIsPending(true)
        try {
          const res = await fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          });
    
          if (res.ok) {
            showToast("Logout Successful","success")
            router.push('/login');
          } else {
            showToast("Logout Failed","error")
          }
        } catch (error) {
          console.error('Logout error:', error);
          showToast("Something went wrong","error")
        }finally{
            setIsPending(false)
        }
      };
    return (
        <>
            <button
                onClick={handleLogout}
                disabled={isPending}
                className="block py-2 px-3 rounded-sm md:border-0 md:p-0 text-white md:hover:text-red-500 hover:bg-gray-700 hover:text-white md:hover:bg-transparent"
            >
                {isPending ? "Logging out..." : "Logout"}
            </button>
            {toast && (
                <ToastMessage
                text={toast.text}
                type={toast.type}
                onClose={() => setToast(null)}
                />
            )}
        </>
        
    );
};

export default LogoutForm;
