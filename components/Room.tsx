import mongoose from "mongoose";

const Room = ({ roomNumber }: { roomNumber: number}) => {
    

    return (
      <div className="
      bg-white 
      h-40 
      w-40 
      text-black
      rounded-md
      flex
      flex-col
      items-center
      justify-center
      font-mono">
        <div className="text-lg">
            {roomNumber}
        </div>     
      </div>
    );
  };
  
  export default Room;