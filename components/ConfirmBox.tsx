export default function ConfirmBox({
  isOpen,
  onConfirm,
  onCancel,
  text,
}: {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  text: string;
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50
         transition-transform duration-200 ease-out scale-100 backdrop-blur-md rounded-lg        
        "
    >
      <div className="bg-[#1e1e1e] p-6 rounded shadow-lg text-center border border-[#4e4e4e]">
        <p className="mb-4">Are you sure you want to {text}?</p>
        <div className="flex flex-row gap-5 justify-center">
          <button
            onClick={onCancel}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-green-500 text-white px-4 py-2 rounded mr-2"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
