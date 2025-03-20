"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import "react-datepicker/dist/react-datepicker.css";
import ConfirmBox from "./ConfirmBox";
import DatePickerModal from "./DatePickeModal";
import ToastMessage from "./ToastMessage";
import RoomTable from "./BookingTable";

const BookingForm = () => {
  const [submitting, setSubmitting] = useState(false);

  const [buildings, setBuildings] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState("");

  const [rooms, setRooms] = useState([]);

  const [dateRange, setDateRange] = useState([
    null,
    null,
  ]);
  const [startDate, endDate] = dateRange;

  const [showDatePicker, setShowDatePicker] = useState(false);

  const [roomsState, setRoomsState] = useState([]);

  const router = useRouter();

  const [okPressed, setOkPressed] = useState(false);

  const [state, setState] = useState(null);
  const nameInput = useRef(null);

  const selectedRoomsRef = useRef([]);

  const [toast, setToast] = useState(null);

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
    setState(1);
    fetchBuildings();
  }, []);

  useEffect(() => {
    const fetchRooms = async () => {
      if (selectedBuilding === "Select") return;
      try {
        const response = await fetch(
          `/api/building/${selectedBuilding}`
        );
        const data = await response.json();
        setRooms(data.rooms);
      } catch (error) {
        console.log(error);
      }
    };

    fetchRooms();
  }, [selectedBuilding]);

  const fetchRoomsState = async () => {
    selectedRoomsRef.current = [];
    try {
      const response = await fetch(`/api/getbookedrooms`);
      const data = await response.json();
      setRoomsState(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeBuilding = (
    event
  ) => {
    setSelectedBuilding(event.target.value);
    fetchRoomsState();
  };

  const getRoomState = (date, roomId) => {
    const existingBookedRoom = roomsState.find(
      (bookedRoom) => {
        return bookedRoom.date === date && bookedRoom.roomId === roomId;
      }
    );

    if (existingBookedRoom) {
      return { status: "Occupied", by: existingBookedRoom.by };
    }

    const existingSelected
       = selectedRoomsRef.current.find(
      (bookedRoom) => {
        return bookedRoom.date === date && bookedRoom.roomId === roomId;
      }
    );

    if (existingSelected) {
      return { status: state === 1 ? "Selected" : "DeleteSelected", by: "" };
    }

    return { status: "Unselected", by: "" };
  };

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
  };

  const confirmSubmission = async () => {
    try {
      if (selectedRoomsRef.current.length === 0) {
        throw new Error("No rooms selected.");
      }
      let response;
      if (state == 1) {
        const bookedBy = nameInput?.current?.value;
        if (!bookedBy) {
          throw new Error("Please enter a name.");
        }
        response = await fetch("/api/bookroom", {
          method: "POST",
          body: JSON.stringify({
            bookings: selectedRoomsRef.current,
            by: bookedBy,
          }),
        });
      } else {
        response = await fetch("/api/bookroom", {
          method: "DELETE",
          body: JSON.stringify({ bookings: selectedRoomsRef.current }),
        });
      }
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to process request.");
      }
      setToast({
        text: state === 1 ? "Booked successfully!" : "Deleted successfully!",
        type: "success",
      });
    } catch (error) {
      setToast({ text: error.message, type: "error" });
    } finally {
      setSubmitting(false);
      fetchRoomsState();
      clearNameInput();
    }
  };

  const clearNameInput = () => {
    if (nameInput.current) {
      nameInput.current.value = "";
    }
  };

  const generateDates = (start, end) => {
    const dateArray = [];
    let cur = new Date(start);
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
      <div className="flex flex-col items-center">
        <div className="flex flex-row gap-10 justify my-2 bg-transparent border text-white px-4 py-2 rounded-lg h-10 max-w-max">
          <div
            className="flex items-center"
            onClick={() => {
              setState(1);
              selectedRoomsRef.current = [];
            }}
          >
            <input
              id="inline-radio"
              type="radio"
              value=""
              name="inline-radio-group"
              className="cursor-pointer text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-0"
              defaultChecked
              disabled={!state}
            />
            <label htmlFor="inline-radio" className="ms-2 cursor-pointer">
              Book
            </label>
          </div>
          <div
            className="flex items-center"
            onClick={() => {
              setState(2);
              selectedRoomsRef.current = [];
            }}
          >
            <input
              id="inline-2-radio"
              type="radio"
              value=""
              name="inline-radio-group"
              className="cursor-pointer text-[#9dabff] focus:ring-[#9dabff] focus:ring-0"
              disabled={!state}
            />
            <label htmlFor="inline-2-radio" className="ms-2 cursor-pointer">
              Cancel
            </label>
          </div>
        </div>
      </div>
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
                (building) => (
                  <option
                    key={building._id.toString()}
                    value={building._id.toString()}
                  >
                    {building.name}
                  </option>
                )
              )}
          </select>
        </div>
        <div className="flex flex-col justify-center items-center w-52">
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
        </div>
        {state === 1 && (
          <div className="py-2 w-52">
            <input
              type="text"
              className="max-w-max flex h-10 rounded-lg bg-[#282828]
                    text-[#8b8b8b] px-2"
              maxLength={10}
              placeholder="Club Name"
              ref={nameInput}
            />
          </div>
        )}
        <div className="flex gap-y-4 gap-10 w-52">
          <div className="flex flex-end gap-10 justify-end my-2 h-10">
            <button
              type="button"
              className="bg-transparent text-white border rounded-md px-4 py-2 font-mono"
              onClick={() => {
                fetchRoomsState();
              }}
            >
              Reset
            </button>
            <button
              type="submit"
              className="bg-[#006eff] text-white border border-[#006eff] rounded-md px-4 py-2 font-mono"
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      <DatePickerModal
        showDatePicker={showDatePicker}
        setShowDatePicker={setShowDatePicker}
        startDate={dateRange[0]}
        endDate={dateRange[1]}
        setDateRange={setDateRange}
        fetchRoomsState={fetchRoomsState}
        setOkPressed={setOkPressed}
      />

      <div>
        <ConfirmBox
          onCancel={() => {
            setSubmitting(false);
            selectedRoomsRef.current = [];
          }}
          isOpen={submitting}
          onConfirm={confirmSubmission}
          text="Submit"
        />
      </div>
      {rooms?.length > 0 && dateArray?.length > 0 && okPressed ? (
        <RoomTable
          rooms={rooms}
          dateArray={dateArray}
          getRoomState={getRoomState}
          selected={selectedRoomsRef}
          state={state}
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

export default BookingForm;
