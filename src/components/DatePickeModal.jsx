import React, { useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "react-bootstrap";

const DatePickerModal = ({
  showDatePicker,
  setShowDatePicker,
  startDate,
  endDate,
  setDateRange,
  fetchRoomsState,
  setOkPressed,
}) => {
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const okButtonRef = useRef(null);

  if (!showDatePicker) return null;

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
         style={{
           backgroundColor: "rgba(0, 0, 0, 0.5)",
           backdropFilter: "blur(8px)",
           zIndex: 1050
         }}>
      {/* Close Button - Top Right Corner */}
      <Button
          ref={closeButtonRef}
          variant="link"
          className="position-absolute top-0 end-0 m-2 p-0 text-light"
          onClick={() => setShowDatePicker(false)}
          style={{ zIndex: 1060 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            className="bi bi-x-lg"
            viewBox="0 0 16 16"
          >
            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
          </svg>
        </Button>
      <div 
        ref={modalRef}
        className="text-light rounded p-4 position-relative"
        style={{ maxWidth: "90%", maxHeight: "90%" }}
      >
        <div className="d-flex justify-content-center py-4">
          <DatePicker
            selected={startDate}
            onChange={(dates) => setDateRange(dates)}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            inline
            className="bg-dark text-light border-0"
          />
        </div>
      </div>
      {/* OK Button - Bottom Right Corner */}
      <Button
        ref={okButtonRef}
        variant="primary"
        className="position-absolute bottom-0 end-0 m-3"
        onClick={() => {
          setShowDatePicker(false);
          fetchRoomsState();
          setOkPressed(true);
        }}
      >
        OK
      </Button>
    </div>
  );
};

export default DatePickerModal;
