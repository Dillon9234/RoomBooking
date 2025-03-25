export default function ConfirmBox({ isOpen, onConfirm, onCancel, text }) {
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop with blur effect */}
            <div className="modal-backdrop fade show" style={{ 
                backdropFilter: 'blur(5px)',
                zIndex: 1040 
            }}></div>
            
            {/* Modal dialog */}
            <div 
                className="modal fade show" 
                style={{ 
                    display: 'block', 
                    zIndex: 1050 
                }} 
                tabIndex="-1" 
                role="dialog"
            >
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content bg-dark text-white border border-secondary">
                        <div className="modal-body text-center">
                            <p>Are you sure you want to {text}?</p>
                            <div className="d-flex justify-content-center gap-3 mt-3">
                                <button onClick={onCancel} className="btn btn-danger">
                                    Cancel
                                </button>
                                <button onClick={onConfirm} className="btn btn-success">
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
