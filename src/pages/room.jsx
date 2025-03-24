"use client";
import { useEffect, useState } from "react";

const Rooms = () => {
  const [buildings, setBuildings] = useState([]);

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const response = await fetch("/api/building");
        const data = await response.json();
        setBuildings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchBuildings();
  }, []);

  return (
    <div className="container py-4">
      <div className="row g-3 justify-content-center">
        {buildings.length > 0 ? (
          buildings.map((building) => (
            <div key={building.name} className="col-6 col-md-3">
              <div className="card text-dark text-center p-3">
                {building.name}
              </div>
            </div>
          ))
        ) : (
          <p>No buildings available</p>
        )}
      </div>
    </div>
  );
};

export default Rooms;
