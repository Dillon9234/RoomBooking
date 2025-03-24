'use client'

import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const CreateBuildingForm = ({ isOpen, onClose, onBuildingAdded, onEditBuilding, onError, building }) => {
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);

        try {
            const formData = new FormData(event.currentTarget);
            const name = formData.get("name");

            const url = building 
                ? `/api/building/${building._id}/edit`
                : '/api/building/new';

            const method = building ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method,
                body: JSON.stringify({ name }),
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                const data = await response.json();
                building ? onEditBuilding(data) : onBuildingAdded(data);
                onClose();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || "An error occurred");
            }
        } catch (error) {
            console.log(error);
            if (onError) {
                onError(error.message || "An error occurred");
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{building ? "Edit Building" : "Create New Building"}</h5>
                        <button type="button" className="close btn btn-light" onClick={onClose}>
                            &times;
                        </button>
                    </div>

                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="font-weight-bold">Name</label>
                                <input 
                                    type="text" 
                                    name="name" 
                                    className="form-control" 
                                    placeholder="Enter building name" 
                                    required 
                                    defaultValue={building?.name}
                                />
                            </div>
                        </form>
                    </div>

                    <div className="modal-footer">
                        <button 
                            type="submit" 
                            className="btn btn-primary" 
                            onClick={handleSubmit}
                            disabled={submitting}
                        >
                            {submitting ? (building ? "Updating..." : "Creating...") : (building ? "Update Building" : "Create Building")}
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateBuildingForm;
