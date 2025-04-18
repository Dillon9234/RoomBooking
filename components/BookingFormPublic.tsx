"use client";

import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import mongoose from "mongoose";
import DatePickerModal from "./DatePickeModal";
import ToastMessage from "./ToastMessage";
import RoomTablePublic from "./BookingTablePublic";
import IBookedRooms from "@/interfaces/IBookedRooms";

const BookingFormPublic = () => {
  const [submitting, setSubmitting] = useState(false);

  const [buildings, setBuildings] = useState<
    {
      _id: mongoose.Types.ObjectId;
      name: string;
      rooms: number;
    }[]
  >([]);
  const [selectedBuilding, setSelectedBuilding] = useState("");

  const [rooms, setRooms] = useState([]);

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [startDate, endDate] = dateRange;

  const [showDatePicker, setShowDatePicker] = useState(false);

  const [roomsState, setRoomsState] = useState<IBookedRooms[]>([]);

  const [okPressed, setOkPressed] = useState(false);

  const [toast, setToast] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const response: Response = await fetch("/api/building");
        const data = await response.json();
        setBuildings(data);
      } catch (error) {
        console.error("Error fetching buildings " + error);
      }
    };
    fetchBuildings();
  }, []);

  useEffect(() => {
    const fetchRooms = async () => {
      if (selectedBuilding === "Select") return;
      try {
        const response: Response = await fetch(
          `/api/building/${selectedBuilding}`,
        );
        const data = await response.json();
        setRooms(data.rooms);
      } catch (error) {
        console.error("Error fetching rooms " + error);
      }
    };

    fetchRooms();
  }, [selectedBuilding]);

  const fetchRoomsState = async () => {
    try {
      const response: Response = await fetch(`/api/getbookedrooms`);
      const data = await response.json();
      setRoomsState(data);
    } catch (error) {
      console.error("Error fetching booked rooms " + error);
    }
  };

  const handleChangeBuilding = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedBuilding(event.target.value);
    fetchRoomsState();
  };

  const getRoomState = (date: string, roomId: string) => {
    const existingBookedRoom: IBookedRooms | undefined = roomsState.find(
      (bookedRoom: IBookedRooms) => {
        return bookedRoom.date === date && bookedRoom.roomId === roomId;
      },
    );

    if (existingBookedRoom) {
      return { status: "Occupied", by: existingBookedRoom.by };
    }
    return { status: "Unselected", by: "" };
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
  };

  const generateDates = (start: Date, end: Date): Date[] => {
    const dateArray: Date[] = [];
    const cur = new Date(start);
    cur.setHours(0, 0, 0, 0);
    while (cur <= end) {
      dateArray.push(new Date(cur));
      cur.setDate(cur.getDate() + 1);
    }
    return dateArray;
  };

  const dateArray =
    startDate && endDate ? generateDates(startDate, endDate) : [];
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col gap-2 font-mono items-center bg-black bg-opacity-50 p-10 rounded-lg border"
    >
      <div className="w-full flex flex-wrap gap-5 justify-evenly">
        <div className="flex flex-col justify-center items-center w-52">
          <select
            name="building"
            value={selectedBuilding}
            id="buildingDropdown"
            onChange={handleChangeBuilding}
            className="focus:bg-black focus:bg-opacity-50 bg-transparent text-white border rounded-lg h-10 p-2 w-full block border-white
                        focus:ring-[#006eff] focus:border-[#006eff] border-collapse"
          >
            <option defaultValue={undefined}>Building</option>
            {buildings &&
              buildings.map(
                (building: {
                  _id: mongoose.Types.ObjectId;
                  name: string;
                  rooms: number;
                }) => (
                  <option
                    key={building._id.toString()}
                    value={building._id.toString()}
                  >
                    {building.name}
                  </option>
                ),
              )}
          </select>
        </div>
        <div className="relative flex flex-col justify-center items-center w-52">
          <button
            type="button"
            onClick={() => {
              setShowDatePicker(!showDatePicker);
              setOkPressed(false);
            }}
            className="bg-transparent bg-[#6c8cff] text-white py-2 px-2 h-10 w-full rounded-lg hover:bg-[#575757] active:bg-[#8b8b8b] border border-white border-collapse"
          >
            Date Range
          </button>
          <DatePickerModal
            showDatePicker={showDatePicker}
            setShowDatePicker={setShowDatePicker}
            startDate={dateRange[0]}
            endDate={dateRange[1]}
            setDateRange={setDateRange}
            fetchRoomsState={fetchRoomsState}
            setOkPressed={setOkPressed}
          />
        </div>
      </div>
      {rooms?.length > 0 && dateArray?.length > 0 && okPressed ? (
        <RoomTablePublic
          rooms={rooms}
          dateArray={dateArray}
          getRoomState={getRoomState}
        />
      ) : (
        <div className="w-full flex items-center justify-center bg-[#282828] rounded-lg border border-[#575757]">
          No Data
        </div>
      )}
      {toast && (
        <ToastMessage
          text={toast.text}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </form>
  );
};

export default BookingFormPublic;
