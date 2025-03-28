import React, { RefObject } from "react";
import SelectedRoom from "./SelectedRoom";
import mongoose from "mongoose";

interface Room {
  number: string;
  _id: string;
}

interface RoomTableProps {
  rooms: Room[];
  dateArray: Date[];
  getRoomState: (
    date: string,
    roomId: mongoose.Types.ObjectId
  ) => { status: string; by: string };
  selected: RefObject<{ date: string; roomId: mongoose.Types.ObjectId }[]>;
  state: number;
}

const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
};

const RoomTable = ({
  rooms,
  dateArray,
  getRoomState,
  selected,
  state,
}: RoomTableProps) => {
  return (
    <div className="relative bg-[#282828] rounded-lg w-full">
      <div className="w-full absolute top-[0.05em] left-[0.05em] text-white overflow-x-clip">
        {/* <table className="z-20 table-auto absolute h-[2.57em]">
          <thead className="text-white sticky top-0">
            <tr>
              <th
                className="left-7 top-5
                            border-r border-b z-20 rounded-tl-lg bg-[#282828] border-solid border-[#575757]"
              >
                Dates
              </th>
              {rooms.map((room) => (
                <th key={room.number} className="p-2">
                  <div className="invisible">{room.number}</div>
                </th>
              ))}
            </tr>
          </thead>
        </table> */}
      </div>
      <div
        className="w-full h-[30em] text-white border border-solid border-[#575757] rounded-lg
                overflow-auto
                [&::-webkit-scrollbar]:w-0
                [&::-webkit-scrollbar]:h-0"
      >
        <table className="table-auto h-full w-full">
          <thead className="text-white">
            <tr className="relative">
              <th className="w-10 p-0 sticky left-0 top-0 z-50">
                <div className="flex justify-center items-center w-full h-12 border-r border-b bg-[#282828] border-solid border-[#575757] p-2 m-0">
                  Dates
                </div>
              </th>
              {rooms.map((room) => (
                <th key={room.number} className="w-10 p-0 sticky top-0 z-10">
                  <div className="flex justify-center items-center w-full h-12 border-r border-b bg-[#282828] border-solid border-[#575757] p-2 m-0">
                    {room.number}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="relative">
            {dateArray.map((date) => (
              <tr key={formatDate(date)}>
                <td className="w-10 p-0 justify-center items-center h-full left-0 text-center sticky z-10">
                  <div className="w-full h-full border border-solid bg-[#282828] border-[#575757] p-1 m-0 items-center flex justify-center">
                    {formatDate(date).slice(0, 5)}
                  </div>
                </td>
                {rooms.map((room: any) => {
                  const status = getRoomState(formatDate(date), room._id);
                  return (
                    <td className="w-10 p-1" key={room._id}>
                      <div className="flex justify-center">
                        <SelectedRoom
                          status={status}
                          globalState={state}
                          room={room}
                          setSelected={(isSelected: boolean) => {
                            if (isSelected) {
                              selected.current.push({
                                date: formatDate(date),
                                roomId: room._id,
                              });
                            } else {
                              const index = selected.current.filter(
                                (cur) =>
                                  !(
                                    cur.date === formatDate(date) &&
                                    cur.roomId === room._id
                                  )
                              );
                            }
                          }}
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

export default RoomTable;
