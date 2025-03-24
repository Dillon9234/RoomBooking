import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
    return (
        <>
            {/* Mobile View Date Picker */}
            <div
                className={`position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50 ${showDatePicker ? "d-flex" : "d-none"}`}
            >
                {/* Close Button */}
                <button
                    type="button"
                    className="btn-close position-absolute top-2 end-2"
                    onClick={() => setShowDatePicker(false)}
                ></button>

                {/* DatePicker Component */}
                <div className="bg-white p-3 rounded shadow">
                    <DatePicker
                        selected={startDate}
                        onChange={(dates) => setDateRange(dates)}
                        startDate={startDate}
                        endDate={endDate}
                        selectsRange
                        inline
                        className="form-control"
                    />
                </div>

                {/* OK Button */}
                <button
                    type="button"
                    className="btn btn-primary position-absolute bottom-3 end-3"
                    onClick={() => {
                        setShowDatePicker(false);
                        fetchRoomsState();
                        setOkPressed(true);
                    }}
                >
                    OK
                </button>
            </div>

            {/* Desktop View Date Picker */}
            <div
                className={`position-absolute top-50 start-50 translate-middle bg-white p-3 rounded shadow ${showDatePicker ? "d-block" : "d-none"}`}
            >
                {/* Close Button */}
                <button
                    type="button"
                    className="btn-close position-absolute top-0 end-0 m-2"
                    onClick={() => setShowDatePicker(false)}
                ></button>

                {/* DatePicker Component */}
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
                    className="form-control"
                />
            </div>
        </>
    );
};

export default DatePickerModal;
