"use client";

import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import ConfirmBox from "./ConfirmBox";
import DatePickerModal from "./DatePickeModal";
import ToastMessage from "./ToastMessage";
import RoomTable from "./BookingTable";
import "bootstrap/dist/css/bootstrap.min.css";

const BookingForm = () => {
  const [submitting, setSubmitting] = useState(false);
  const [buildings, setBuildings] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [rooms, setRooms] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [roomsState, setRoomsState] = useState([]);
  const navigate = useNavigate();
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
        const response = await fetch(`/api/building/${selectedBuilding}`);
        const data = await response.json();
        setRooms(data.rooms);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRooms();
  }, [selectedBuilding]);

  const handleChangeBuilding = (event) => {
    setSelectedBuilding(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
  };

  return (
    <form onSubmit={handleSubmit} className="container bg-dark text-white p-4 rounded border">
      <div className="text-center mb-3">
        <div className="btn-group" role="group">
          <input
            type="radio"
            className="btn-check"
            name="bookingOptions"
            id="bookOption"
            autoComplete="off"
            defaultChecked
            onClick={() => setState(1)}
          />
          <label className="btn btn-outline-primary" htmlFor="bookOption">Book</label>

          <input
            type="radio"
            className="btn-check"
            name="bookingOptions"
            id="cancelOption"
            autoComplete="off"
            onClick={() => setState(2)}
          />
          <label className="btn btn-outline-danger" htmlFor="cancelOption">Cancel</label>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-4">
          <select
            className="form-select"
            name="building"
            value={selectedBuilding}
            onChange={handleChangeBuilding}
          >
            <option value="">Select Building</option>
            {buildings.map((building) => (
              <option key={building._id} value={building._id}>{building.name}</option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
          <button
            type="button"
            className="btn btn-primary w-100"
            onClick={() => setShowDatePicker(!showDatePicker)}
          >
            Select Date Range
          </button>
        </div>

        {state === 1 && (
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Club Name"
              ref={nameInput}
            />
          </div>
        )}
      </div>

      <div className="d-flex justify-content-end gap-2">
        <button type="button" className="btn btn-secondary" onClick={() => {}}>
          Reset
        </button>
        <button type="submit" className="btn btn-success">
          Submit
        </button>
      </div>
    </form>
  );
};

export default BookingForm;