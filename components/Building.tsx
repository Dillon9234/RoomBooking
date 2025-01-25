'use client'
import mongoose from "mongoose";
import { useRouter } from "next/navigation";

const Building = ({ buildingName, buildingId }: { buildingName:string, buildingId:mongoose.Types.ObjectId}) => {

    const router = useRouter()
    const handleClick = () => {
        router.push(`/building/${buildingId}`)
    }

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
      font-mono
      cursor-pointer"
      onClick={handleClick}
      >
        <div className="text-lg">
            {buildingName}
        </div>    
        
      </div>
    );
  };
  
  export default Building;