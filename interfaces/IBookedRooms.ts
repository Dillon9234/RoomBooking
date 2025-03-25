import { Types } from "mongoose";

interface IBookedRooms {
    date: string;
    roomId: Types.ObjectId;
    by: string;
}

export default IBookedRooms;