import React, { useEffect, useRef, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import DatePickerModal from "./DatePickeModal";
import ToastMessage from "./ToastMessage";
import RoomTable from "./BookingTable";
import Swal from 'sweetalert2';


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

  const [okPressed, setOkPressed] = useState(false);

  const [state, setState] = useState(null);
  const nameInput = useRef(null);

  const selectedRoomsRef = useRef([]);

  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        // Modified to use a more generic API endpoint approach
        const response = await fetch("http://localhost:3000/api/building");
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
          `http://localhost:3000/api/building/${selectedBuilding}`
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
      const response = await fetch(`http://localhost:3000/api/getbookedrooms`);
      const data = await response.json();
      setRoomsState(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeBuilding = (event) => {
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

    const existingSelected = selectedRoomsRef.current.find(
      (bookedRoom) => {
        return bookedRoom.date === date && bookedRoom.roomId === roomId;
      }
    );

    if (existingSelected) {
      return { status: state === 1 ? "Selected" : "DeleteSelected", by: "" };
    }

    return { status: "Unselected", by: "" };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const result = await Swal.fire({
      title: 'Submit Application?',
      html: 'You are about to submit your application for <b>Frontend Developer</b>. Please review your information before confirming.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Submit Application',
      cancelButtonText: 'Review Changes',
      reverseButtons: true,
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-outline-secondary'
      }
    });
  
    if (result.isConfirmed) {
      await confirmSubmission();
      Swal.fire('Success!', 'Your application has been submitted.', 'success');
    }
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
        response = await fetch("http://localhost:3000/api/bookroom", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            bookings: selectedRoomsRef.current,
            by: bookedBy,
          }),
        });
      } else {
        response = await fetch("http://localhost:3000/api/bookroom", {
          method: "DELETE",
          headers: {
            'Content-Type': 'application/json'
          },
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
      className="container-fluid p-4 bg-dark bg-opacity-50 rounded border"
    >
      <div className="d-flex flex-column align-items-center mb-3">
        <div className="d-flex gap-4 bg-transparent border text-white p-2 rounded">
          <div
            className="form-check form-check-inline"
            onClick={() => {
              setState(1);
              selectedRoomsRef.current = [];
            }}
          >
            <input
              id="inline-radio"
              type="radio"
              name="inline-radio-group"
              className="form-check-input cursor-pointer"
              defaultChecked
              disabled={!state}
            />
            <label htmlFor="inline-radio" className="form-check-label cursor-pointer">
              Book
            </label>
          </div>
          <div
            className="form-check form-check-inline"
            onClick={() => {
              setState(2);
              selectedRoomsRef.current = [];
            }}
          >
            <input
              id="inline-2-radio"
              type="radio"
              name="inline-radio-group"
              className="form-check-input cursor-pointer"
              disabled={!state}
            />
            <label htmlFor="inline-2-radio" className="form-check-label cursor-pointer">
              Cancel
            </label>
          </div>
        </div>
      </div>
      
      <div className="row mb-3 justify-content-center">
        <div className="col-md-3 mb-3">
          <select
            name="building"
            value={selectedBuilding}
            id="buildingDropdown"
            onChange={handleChangeBuilding}
            className="form-select bg-dark text-white border rounded"
          >
            <option defaultValue={undefined}>Building</option>
            {buildings &&
              buildings.map((building) => (
                <option
                  key={building._id.toString()}
                  value={building._id.toString()}
                >
                  {building.name}
                </option>
              ))}
          </select>
        </div>
        
        <div className="col-md-3 mb-3">
          <button
            type="button"
            onClick={() => {
              setShowDatePicker(!showDatePicker);
              setOkPressed(false);
            }}
            className="btn btn-primary w-100"
          >
            Date Range
          </button>
        </div>
        
        {state === 1 && (
          <div className="col-md-3 mb-3">
            <input
              type="text"
              className="form-control bg-secondary text-white"
              maxLength={10}
              placeholder="Club Name"
              ref={nameInput}
            />
          </div>
        )}
        
        <div className="col-md-3 mb-3">
          <div className="d-flex gap-2 justify-content-end">
            <button
              type="button"
              className="btn btn-outline-light"
              onClick={() => {
                fetchRoomsState();
              }}
            >
              Reset
            </button>
            <button
              type="submit"
              className="btn btn-primary"
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
      
      {rooms?.length > 0 && dateArray?.length > 0 && okPressed ? (
        <RoomTable
          rooms={rooms}
          dateArray={dateArray}
          getRoomState={getRoomState}
          selected={selectedRoomsRef}
          state={state}
        />
      ) : (
        <div className="w-100 d-flex align-items-center justify-content-center bg-secondary p-3 rounded border border-light">
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