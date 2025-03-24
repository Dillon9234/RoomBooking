import SelectedRoom from "./SelectedRoom";
import React from "react";

const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
};

const RoomTable = ({ rooms, dateArray, getRoomState, selected, state }) => {
  return (
    <div className="position-relative bg-dark rounded w-100">
      <div className="w-100" style={{ maxHeight: "30em", overflow: "auto" }}>
        <table className="table table-dark table-bordered m-0">
          <thead>
            <tr>
              <th className="text-center align-middle bg-secondary position-sticky top-0" style={{ left: 0, zIndex: 50 }}>
                Dates
              </th>
              {rooms.map((room) => (
                <th key={room.number} className="text-center align-middle bg-secondary position-sticky top-0">
                  {room.number}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dateArray.map((date) => (
              <tr key={formatDate(date)}>
                <td className="text-center align-middle bg-secondary position-sticky" style={{ left: 0, zIndex: 10 }}>
                  {formatDate(date).slice(0, 5)}
                </td>
                {rooms.map((room) => {
                  const status = getRoomState(formatDate(date), room._id);
                  return (
                    <td className="text-center align-middle" key={room._id}>
                      <SelectedRoom
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