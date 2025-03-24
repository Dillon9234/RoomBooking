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
        <div className={`position-fixed bottom-2 end-0 d-flex align-items-center gap-3 px-4 py-2 rounded-start shadow-lg z-50 
            ${fadeOut ? "opacity-0" : "opacity-100"} 
            ${type === "success" ? "bg-success text-dark" : "bg-danger text-white"}`}
        >
            {type === "success" ? <CheckCircleFill size={20} /> : <XCircleFill size={20} />}
            
            <span className="fw-bold">{text}</span>

            <button onClick={() => { setFadeOut(true); onClose(); }} className="btn-close btn-close-white"></button>
        </div>
    );
}
