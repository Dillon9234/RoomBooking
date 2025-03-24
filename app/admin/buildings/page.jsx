// app/admin/buildings/page.jsx
"use client";
import { useEffect, useState } from "react";
import CreateBuildingForm from "@/components/CreateBuildingForm";
import ToastMessage from "@/components/ToastMessage";
import Link from "next/link";
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminBuildings = () => {
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchBuildings();
  }, []);

  const fetchBuildings = async () => {
    try {
      setLoading(true);
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

  const showToast = (message, type) => {
    setToast({ text: message, type });
  };

  const handleEditBuilding = (building) => {
    setSelectedBuilding(building);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const handleDeleteBuilding = async (building) => {
    if (!confirm(`Are you sure you want to delete "${building.name}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/building/${building._id}/edit`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setBuildings(buildings.filter((b) => b._id !== building._id));
        showToast(`Building "${building.name}" deleted successfully`, "success");
      } else {
        throw new Error(data.message || "Failed to delete building");
      }
    } catch (error) {
      console.error(error);
      showToast(error.message || "Failed to delete building", "danger");
    }
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setIsEditing(false);
    setSelectedBuilding(null);
  };

  return (
    <div className="container py-4">
      <h1 className="mb-4">Building Management</h1>
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Link href="/admin" className="btn btn-outline-secondary">
          &larr; Back to Admin
        </Link>
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

      {toast && (
        <ToastMessage
          message={toast.text}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {isFormOpen && (
        <CreateBuildingForm
          isOpen={isFormOpen}
          onClose={closeForm}
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

      {loading && (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading buildings...</span>
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && buildings.length === 0 && (
        <div className="alert alert-info" role="alert">
          No buildings available. Create a new building to get started.
        </div>
      )}

      {buildings.length > 0 && !loading && (
        <div className="card shadow-sm">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>Building Name</th>
                    <th>Number of Rooms</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {buildings.map((building) => (
                    <tr key={building._id}>
                      <td>{building.name}</td>
                      <td>{building.rooms?.length || 0}</td>
                      <td>
                        <div className="btn-group" role="group">
                          <button 
                            className="btn btn-sm btn-outline-primary me-2" 
                            onClick={() => handleEditBuilding(building)}
                          >
                            Edit
                          </button>
                          <Link 
                            href={`/admin/buildings/${building._id}/rooms`}
                            className="btn btn-sm btn-outline-secondary me-2"
                          >
                            Manage Rooms
                          </Link>
                          <button 
                            className="btn btn-sm btn-outline-danger" 
                            onClick={() => handleDeleteBuilding(building)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBuildings;