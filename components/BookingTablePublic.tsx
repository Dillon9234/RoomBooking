import React from "react";
import SelectedRoom from "./SelectedRoom";

interface Room {
  number: string;
  _id: string;
}

interface RoomTableProps {
  rooms: Room[];
  dateArray: Date[];
  getRoomState: (
    date: string,
    roomId: string
  ) => { status: string; by: string };
}

const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
};

const RoomTablePublic = ({
  rooms,
  dateArray,
  getRoomState,
}: RoomTableProps) => {
  return (
    <div className="relative bg-[#282828] rounded-lg w-full">
      <div
        className="w-full h-[30em] text-white border border-solid border-[#575757] rounded-lg
                overflow-auto"
      >
        <table className="table-auto h-full w-full">
          <thead className="text-white">
            <tr className="relative">
              <th className="w-10 p-2 sticky left-0 top-0 z-20 outline outline-1  outline-[#575757] bg-[#282828]">
                Dates
              </th>
              {rooms.map((room:Room) => (
                <th key={room.number} className="w-10 p-2 sticky top-0 z-10 outline outline-1 outline-[#575757] bg-[#282828]">
                  {room.number}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="relative">
            {dateArray.map((date) => (
              <tr key={formatDate(date)}>
                <td className="w-10 p-1 text-center sticky left-0 z-10 outline outline-1 outline-[#575757] bg-[#282828] h-12 align-middle">
                {formatDate(date).slice(0, 5)}
              </td>
                {rooms.map((room: Room) => {
                  const status = getRoomState(formatDate(date), room._id);
                  return (
                    <td className="w-10 p-1" key={room._id}>
                      <div className="flex justify-center">
                        <SelectedRoom
                          status={status}
                          globalState={0}
                          setSelected={() => {}}
                        />
                      </div>
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

export default RoomTablePublic;
