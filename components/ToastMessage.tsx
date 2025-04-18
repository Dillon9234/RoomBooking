import { useState, useEffect } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

interface toastMessageProps {
  text: string;
  type: "error" | "success" | "info";
  onClose: () => void;
}

export default function ToastMessage({
  text,
  type,
  onClose,
}: toastMessageProps) {
  const [show, setShow] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      const closeTimer = setTimeout(() => {
        setShow(false);
        onClose();
      }, 300);

      return () => clearTimeout(closeTimer);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!show) return null;

  return (
    <div
      className={`fixed bottom-2 right-0 flex items-center gap-3 px-5 py-3 rounded-l-lg shadow-lg z-50
            transition-opacity duration-300 ease-out
            ${fadeOut ? "opacity-0" : "opacity-100"}
            ${type === "success" ? "bg-green-500 text-black" : "bg-red-500 text-white"}`}
    >
      {type === "success" ? (
        <CheckCircle className="w-5 h-5" />
      ) : (
        <XCircle className="w-5 h-5" />
      )}

      <span className="font-medium">{text}</span>

      <button
        onClick={() => {
          setFadeOut(true);
          onClose();
        }}
        className={`ml-auto transition
                ${type === "success" ? " text-black hover:text-gray-600 transition" : "text-white hover:text-gray-300"}`}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
