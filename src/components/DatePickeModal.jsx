import React, { useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Modal, Button, CloseButton, Overlay, Popover } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const DatePickerModal = ({
  showDatePicker,
  setShowDatePicker,
  startDate,
  endDate,
  setDateRange,
  fetchRoomsState,
  setOkPressed,
}) => {
  // Reference for the popover target
  const target = useRef(null);
  
  // Track window width for responsive behavior
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

  // Update isMobile state when window resizes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Add a class to the body to prevent background scrolling when modal is open
  useEffect(() => {
    if (showDatePicker) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showDatePicker]);

  return (
    <>
      {/* Reference element for desktop popover positioning */}
      <div ref={target} className="d-none d-md-block" style={{ position: "absolute", top: "22.3rem", left: "16rem" }}></div>

      {/* Mobile View Date Picker */}
      <Modal
        show={showDatePicker && isMobile}
        onHide={() => setShowDatePicker(false)}
        centered
        contentClassName="bg-light rounded p-4 position-relative"
        backdropClassName="bg-dark bg-opacity-50"
      >
        {/* Close Button */}
        <CloseButton
          className="position-absolute top-0 end-0 m-2 text-secondary"
          onClick={() => setShowDatePicker(false)}
        />

        {/* DatePicker Component */}
        <Modal.Body className="d-flex justify-content-center">
          <DatePicker
            selected={startDate}
            onChange={(dates) => setDateRange(dates)}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            inline
            className="p-2 rounded"
          />
        </Modal.Body>

        {/* OK Button */}
        <Modal.Footer className="border-0 justify-content-end">
          <Button
            variant="primary"
            onClick={() => {
              setShowDatePicker(false);
              fetchRoomsState();
              setOkPressed(true);
            }}
          >
            OK
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Desktop View Date Picker - Using Overlay and Popover */}
      <Overlay
        show={showDatePicker && !isMobile}
        target={target.current}
        placement="bottom"
        container={document.body}
        containerPadding={20}
        rootClose
        onHide={() => setShowDatePicker(false)}
      >
        <Popover id="datepicker-popover" className="border-0 shadow">
          <Popover.Header className="bg-white border-bottom-0 pb-0 d-flex justify-content-end">
            <Button 
              variant="light"
              size="sm"
              className="rounded-circle p-0 d-flex align-items-center justify-content-center"
              style={{ width: "25px", height: "25px" }}
              onClick={() => setShowDatePicker(false)}
            >
              <span aria-hidden="true">&times;</span>
            </Button>
          </Popover.Header>
          <Popover.Body className="pt-0">
            <DatePicker
              selected={startDate}
              onChange={(dates) => {
                setDateRange(dates);
                let [start, end] = dates;
                if (start && end) {
                  setShowDatePicker(false);
                  fetchRoomsState();
                  setOkPressed(true);
                }
              }}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              inline
              className="border-0"
            />
          </Popover.Body>
        </Popover>
      </Overlay>
    </>
  );
};

export default DatePickerModal;