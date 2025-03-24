"use client";
import { useEffect, useState } from "react";
import CreateBuildingForm from "../../components/CreateBuildingForm";
import ToastMessage from "../../components/ToastMessage";

const Buildings = () => {
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const response = await fetch("/api/building");
        if (!response.ok) throw new Error("Failed to fetch buildings");
        const data = await response.json();
        setBuildings(data);
      } catch (err) {
        setError(err.message);
        showToast(err.message, "danger");
      } finally {
        setLoading(false);
      }
    };
    fetchBuildings();
  }, []);

  const showToast = (message, type) => {
    setToast({ text: message, type });
  };

  const handleEditBuilding = (building) => {
    setSelectedBuilding(building);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const handleDeleteBuilding = async (building) => {
    try {
      const response = await fetch(`/api/building/${building._id}/edit`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setBuildings(buildings.filter((b) => b._id !== building._id));
        showToast(`Building "${building.name}" deleted successfully`, "success");
      } else {
        throw new Error("Failed to delete building");
      }
    } catch (error) {
      console.log(error);
      showToast(error.message || "Failed to delete building", "danger");
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-end mb-3">
        <button
          className="btn btn-primary"
          onClick={() => {
            setSelectedBuilding(null);
            setIsEditing(false);
            setIsFormOpen(true);
          }}
        >
          Create Building
        </button>
      </div>

      {isFormOpen && (
        <CreateBuildingForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setIsEditing(false);
            setSelectedBuilding(null);
          }}
          onBuildingAdded={(newBuilding) => {
            setBuildings((prev) => [...prev, newBuilding]);
            showToast(`Building "${newBuilding.name}" created successfully`, "success");
          }}
          onEditBuilding={(updatedBuilding) => {
            setBuildings((prevBuildings) =>
              prevBuildings.map((b) => (b._id === updatedBuilding._id ? updatedBuilding : b))
            );
            showToast(`Building "${updatedBuilding.name}" updated successfully`, "success");
          }}
          onError={(errorMessage) => {
            showToast(errorMessage, "danger");
          }}
          building={selectedBuilding}
        />
      )}

      {loading && <p>Loading buildings...</p>}
      {error && <p className="text-danger">{error}</p>}
      {!loading && !error && buildings.length === 0 && <p>No buildings available</p>}

      {buildings.length > 0 && (
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Building Name</th>
              <th>Number of Rooms</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {buildings.map((building) => (
              <tr key={building._id || building.name}>
                <td>{building.name}</td>
                <td>{building.rooms?.length || "N/A"}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditBuilding(building)}>
                    Edit
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDeleteBuilding(building)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Buildings;
