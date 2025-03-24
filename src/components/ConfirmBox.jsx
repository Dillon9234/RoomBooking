export default function ConfirmBox({ isOpen, onConfirm, onCancel, text }) {
    if (!isOpen) return null;

    return (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content bg-dark text-white">
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
    );
}
