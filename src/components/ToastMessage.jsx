import { useState, useEffect } from "react";
import { CheckCircleFill, XCircleFill, X } from "react-bootstrap-icons";

export default function ToastMessage({ text, type, onClose }) {
    const [show, setShow] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setFadeOut(true);
            setTimeout(() => {
                setShow(false);
                onClose();
            }, 300);
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    if (!show) return null;

    return (
        <div 
            className={`position-fixed bottom-0 end-0 mb-4 me-4 d-flex align-items-center gap-3 px-4 py-2 rounded-start shadow-lg z-3 
                ${fadeOut ? "opacity-0" : "opacity-100"} 
                ${type === "success" ? "bg-success text-dark" : "bg-danger text-white"}`}
            style={{ 
                transition: "opacity 0.3s ease-in-out",
                zIndex: 9999
            }}
        >
            {type === "success" ? <CheckCircleFill size={20} /> : <XCircleFill size={20} />}
            
            <span className="fw-bold">{text}</span>

            <button 
                onClick={() => { 
                    setFadeOut(true); 
                    setTimeout(() => onClose(), 300);
                }} 
                className="btn-close btn-close-white"
            ></button>
        </div>
    );
}
