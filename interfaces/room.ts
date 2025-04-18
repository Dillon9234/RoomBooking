import { Types } from "mongoose";

interface IRoom {
  number: number;
  capacity?: number;
  building: Types.ObjectId;
}

export default IRoom;
