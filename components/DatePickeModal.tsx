import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DatePickerModalProps {
    showDatePicker: boolean;
    setShowDatePicker: (show: boolean) => void;
    startDate: Date | null;
    endDate: Date | null;
    setDateRange: (dates: [Date | null, Date | null]) => void;
    fetchRoomsState: () => void;
    setOkPressed: (pressed: boolean) => void;
}

const DatePickerModal = ({
    showDatePicker,
    setShowDatePicker,
    startDate,
    endDate,
    setDateRange,
    fetchRoomsState,
    setOkPressed,
}:DatePickerModalProps) => {
    return (
        <>
            {/* Mobile View Date Picker */}
            <div
                className={`fixed inset-1 z-50 flex items-center justify-center bg-black/30
                transition-transform duration-200 ease-out scale-100 md:hidden bg-opacity-50 backdrop-blur-md rounded-lg
                ${showDatePicker ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"}`}
            >
                {/* Close Button */}
                <button
                    type="button"
                    className="absolute top-2 right-2 text-[#8b8b8b] hover:text-black"
                    onClick={() => setShowDatePicker(false)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* DatePicker Component */}
                <DatePicker
                    selected={startDate}
                    onChange={(dates: [Date | null, Date | null]) => setDateRange(dates)}
                    startDate={startDate}
                    endDate={endDate}
                    selectsRange
                    inline
                    className="p-2 rounded inline-block"
                />

                {/* OK Button */}
                <div className="absolute bottom-10 right-10">
                    <button
                        type="button"
                        className="bg-[#6c8cff] text-black rounded-lg px-4 py-2 hover:bg-blue-600 transition"
                        onClick={() => {
                            setShowDatePicker(false);
                            fetchRoomsState();
                            setOkPressed(true);
                        }}
                    >
                        OK
                    </button>
                </div>
            </div>

            {/* Desktop View Date Picker */}
            <div
                className={`absolute top-[3em] z-50 mt-2 bg-white shadow-2xl rounded p-2 shadow-[#575757]
                border border-gray-200 transition-transform duration-200 ease-out scale-100 hidden md:block
                ${showDatePicker ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"}`}
            >
                {/* Close Button */}
                <div
                    className="absolute top-[-0.5rem] right-[-0.5rem] bg-red-600 text-white rounded-full p-1 cursor-pointer z-30 flex items-center justify-center w-6 h-6"
                    onClick={() => setShowDatePicker(false)}
                >
                    X
                </div>

                {/* DatePicker Component */}
                <DatePicker
                    selected={startDate}
                    onChange={(dates: [Date | null, Date | null]) => {
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
                    className="p-2 rounded inline-block"
                />
            </div>
        </>
    );
};

export default DatePickerModal;
