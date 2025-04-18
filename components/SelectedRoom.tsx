"use client";

import React, { useEffect, useState } from "react";

interface selectedRoomsProps {
  status: {
    status: string;
    by: string;
  };
  setSelected: (isSelected: boolean) => void;
  globalState: number;
}

const SelectedRoom = ({
  status,
  setSelected,
  globalState,
}: selectedRoomsProps) => {
  const [curStatus, setCurStatus] = useState("");

  const [backgroundColorClass, setBackgroundColorClass] = useState("");

  useEffect(() => {
    setCurStatus(status.status);
  }, [status]);

  useEffect(() => {
    const statusColorMap: { [key: string]: string } = {
      Selected: "bg-[#38FF7E]",
      Occupied: "bg-[#353535]",
      Unselected: "bg-[#8b8b8b]",
      DeleteSelected: "bg-[#38FF7E]",
    };
    setBackgroundColorClass(statusColorMap[curStatus]);
  }, [curStatus]);

  const handleClick = () => {
    if (globalState == 1) {
      if (curStatus === "Occupied") return;
      else if (curStatus === "Selected") {
        setCurStatus("Unselected");
        setSelected(false);
      } else {
        setCurStatus("Selected");
        setSelected(true);
      }
    } else if (globalState == 2) {
      if (curStatus === "Occupied") {
        setCurStatus("DeleteSelected");
        setSelected(true);
      } else if (curStatus === "DeleteSelected") {
        setCurStatus("Occupied");
        setSelected(false);
      }
    }
  };

  return (
    <div
      className={`${backgroundColorClass} rounded-lg aspect-square p-1 w-10 flex justify-center items-center cursor-pointer text-white break-all overflow-hidden`}
      onClick={handleClick}
    >
      <div
        className={`whitespace-normal ${curStatus === "DeleteSelected" ? "text-black" : "text-white"}`}
      >
        {(curStatus === "Occupied" || curStatus === "DeleteSelected") &&
          status.by}
      </div>
    </div>
  );
};

export default SelectedRoom;
