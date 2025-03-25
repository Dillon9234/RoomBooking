import { Types } from "mongoose";

interface IBuilding {
    name: string;
    rooms: Types.ObjectId[];
}

export default IBuilding;
