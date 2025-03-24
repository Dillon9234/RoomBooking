// app/buildings/page.jsx
'use client';
import { useEffect, useState } from "react";
import Link from "next/link";
import 'bootstrap/dist/css/bootstrap.min.css';

const Buildings = () => {
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const response = await fetch('/api/building');
        if (!response.ok) throw new Error("Failed to fetch buildings");
        const data = await response.json();
        setBuildings(data);
      } catch (error) {
        console.error("Error fetching buildings:", error);
        setError(error.message || "Failed to load buildings");
      } finally {
        setLoading(false);
      }
    };

    fetchBuildings();
  }, []);

  if (loading) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Available Buildings</h1>
      
      {buildings.length === 0 ? (
        <div className="alert alert-info">No buildings available at the moment.</div>
      ) : (
        <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-4">
          {buildings.map((building) => (
            <div key={building._id} className="col">
              <Link 
                href={`/buildings/${building._id}/rooms`} 
                className="text-decoration-none"
              >
                <div className="card h-100 shadow-sm">
                  <div className="card-body d-flex flex-column justify-content-center align-items-center p-4">
                    <h5 className="card-title text-center mb-3">{building.name}</h5>
                    <p className="card-text text-center text-muted mb-0">
                      {building.rooms?.length || 0} Room{building.rooms?.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Buildings;