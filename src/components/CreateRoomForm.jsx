"use client";

import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const CreateRoomForm = ({
  isOpen,
  onClose,
  onRoomAdded,
  onEditRoom,
  onError,
  room,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [buildings, setBuildings] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      const number = formData.get("number");
      const capacity = formData.get("capacity");
      const buildingId = room ? room.building._id : formData.get("building");

      const response = await fetch(
        room
          ? `http://localhost:3000/api/building/${buildingId}/room/${room._id}`
          : `http://localhost:3000/api/building/${buildingId}/room/new`,
        {
          method: room ? "PATCH" : "POST",
          body: JSON.stringify({ number, capacity }),
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      // Log the raw response text for debugging
      const responseText = await response.text();
      console.log("Raw Response:", responseText);

      // Try to parse the response as JSON
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (parseError) {
        console.error("JSON Parsing Error:", parseError);
        throw new Error(`Response is not valid JSON: ${responseText}`);
      }

      if (response.ok) {
        room ? onEditRoom(responseData) : onRoomAdded(responseData);
        onClose();
      } else {
        throw new Error(responseData?.message || "Operation failed");
      }
    } catch (error) {
      console.error("Submit Error:", error);
      onError?.(error.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        // Check if the route exists and is correct
        const response = await fetch("http://localhost:3000/api/building", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        // Log the raw response for debugging
        const responseText = await response.text();
        console.log("Raw Buildings Response:", responseText);

        // Check if the response is OK
        if (!response.ok) {
          throw new Error(
            `HTTP error! status: ${response.status}, response: ${responseText}`
          );
        }

        // Try to parse the response
        let data;
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error("JSON Parsing Error:", parseError);
          throw new Error(`Failed to parse buildings: ${responseText}`);
        }

        // Validate the data
        if (!Array.isArray(data)) {
          throw new Error("Received invalid data format");
        }

        setBuildings(data);

        // Set initial selected building
        if (room) {
          // For editing, use the room's building
          setSelectedBuilding(room.building._id);
        } else if (data.length > 0) {
          // For creating, use the first building
          setSelectedBuilding(data[0]._id);
        }
      } catch (error) {
        console.error("Failed to fetch buildings:", error);
        onError?.(`Failed to fetch buildings: ${error.message}`);
      }
    };

    // Only fetch buildings if the modal is open
    if (isOpen) {
      fetchBuildings();
    }
  }, [isOpen, room, onError]);

  if (!isOpen) return null;

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {room ? "Edit Room" : "Create New Room"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Building</label>
                {room ? (
                  <div className="form-control bg-light">
                    {room.building?.name || "Loading..."}
                  </div>
                ) : (
                  <select
                    name="building"
                    className="form-select"
                    value={selectedBuilding}
                    onChange={(e) => setSelectedBuilding(e.target.value)}
                    required
                  >
                    {buildings.length > 0 ? (
                      buildings.map((building) => (
                        <option key={building._id} value={building._id}>
                          {building.name}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        No buildings available
                      </option>
                    )}
                  </select>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Number</label>
                <input
                  type="text"
                  name="number"
                  className="form-control"
                  placeholder="Enter room number"
                  required
                  defaultValue={room?.number}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Capacity</label>
                <input
                  type="number"
                  name="capacity"
                  className="form-control"
                  placeholder="Enter room capacity"
                  min="1"
                  required
                  defaultValue={room?.capacity || 1}
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting
                    ? room
                      ? "Updating..."
                      : "Creating..."
                    : room
                    ? "Update Room"
                    : "Create Room"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRoomForm;
