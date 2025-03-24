// frontend/src/components/CreateBuildingForm.jsx
import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { createBuilding, updateBuilding } from '../services/api';

const CreateBuildingForm = ({ isOpen, onClose, onBuildingAdded, onEditBuilding, onError, building }) => {
    const [submitting, setSubmitting] = useState(false);
    const [name, setName] = useState(building?.name || '');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        
        try {
            if (building) {
                // Update existing building
                const updatedBuilding = await updateBuilding(building._id, { name });
                onEditBuilding(updatedBuilding);
            } else {
                // Create new building
                const newBuilding = await createBuilding({ name });
                onBuildingAdded(newBuilding);
            }
            
            onClose();
        } catch (error) {
            console.error(error);
            if (onError) {
                onError(error.message || "An error occurred");
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Modal show={isOpen} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{building ? "Edit Building" : "Create New Building"}</Modal.Title>
            </Modal.Header>
            
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Building Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter building name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button 
                    variant="primary" 
                    onClick={handleSubmit} 
                    disabled={submitting}
                >
                    {submitting ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            {building ? "Updating..." : "Creating..."}
                        </>
                    ) : (
                        building ? "Update Building" : "Create Building"
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateBuildingForm;