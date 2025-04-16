import SelectedRoom from "./SelectedRoom";
import PublicSelectedRoom from "./PublicSelectedRoom";
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// Helper function to read a cookie by name
const getCookie = (name) => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return decodeURIComponent(match[2]);
  return null;
};

const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
};

const RoomTable = ({ rooms, dateArray, getRoomState, selected, state }) => {
  const navigate = useNavigate();

  const token = getCookie("token"); // Fetch token from cookie
  let isAdmin = false;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      isAdmin = true;
    } catch (error) {
      console.error("Invalid token");
    }
  }

  return (
    <div className="position-relative bg-dark rounded w-100">
      <div className="w-100" style={{ maxHeight: "30em", overflow: "auto" }}>
        <table className="table table-dark m-0" style={{ borderCollapse: "separate", borderSpacing: 0 }}>
          <thead>
            <tr>
              <th 
                className="text-center align-middle bg-secondary position-sticky top-0 start-0" 
                style={{ 
                  left: 0, 
                  zIndex: 100,
                  border: "1px solid #dee2e6",
                  borderSpacing: 0
                }}
              >
                Dates
              </th>
              {rooms.map((room) => (
                <th 
                  key={room.number} 
                  className="text-center align-middle bg-secondary position-sticky top-0"
                  style={{
                    zIndex: 50,
                    border: "1px solid #dee2e6",
                    borderLeft: "none"
                  }}
                >
                  {room.number}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dateArray.map((date) => (
              <tr key={formatDate(date)}>
                <td 
                  className="text-center align-middle bg-secondary position-sticky" 
                  style={{ 
                    left: 0, 
                    zIndex: 10,
                    border: "1px solid #dee2e6",
                    borderTop: "none"
                  }}
                >
                  {formatDate(date).slice(0, 5)}
                </td>
                {rooms.map((room) => {
                  const status = getRoomState(formatDate(date), room._id);
                  return (
                    <td 
                      className="text-center align-middle" 
                      key={room._id}
                      style={{
                        border: "1px solid #dee2e6",
                        borderLeft: "none",
                        borderTop: "none"
                      }}
                    >
                      <PublicSelectedRoom
                        status={status}
                        globalState={state}
                        room={room}
                        setSelected={(isSelected) => {
                          if (isSelected) {
                            selected.current.push({
                              date: formatDate(date),
                              roomId: room._id,
                            });
                          } else {
                            selected.current = selected.current.filter(
                              (cur) => !(cur.date === formatDate(date) && cur.roomId === room._id)
                            );
                          }
                        }}
                      />
                      
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoomTable;