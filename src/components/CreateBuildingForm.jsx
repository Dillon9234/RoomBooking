import React, { useEffect, useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { createBuilding, updateBuilding } from "../services/api";

const CreateBuildingForm = ({ isOpen, onClose, building, onBuildingAdded, onEditBuilding, onError }) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (building) {
      setName(building.name || "");
    } else {
      setName("");
    }
  }, [building]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (building) {
        const updated = await updateBuilding(building._id, { name });
        onEditBuilding(updated);
      } else {
        const created = await createBuilding({ name });
        onBuildingAdded(created);
      }
      onClose();
    } catch (error) {
      console.error(error);
      onError(error.message || "Failed to submit building");
    }
  };

  return (
    <Modal show={isOpen} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{building ? "Edit Building" : "Create Building"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="buildingName" className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter building name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>
          <Button type="submit" variant="primary">
            {building ? "Update" : "Create"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateBuildingForm;
