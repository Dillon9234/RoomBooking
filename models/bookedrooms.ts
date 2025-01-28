import { models, model, Schema } from "mongoose";

const BookedRoomsSchema = new Schema({
    date:{
        type:Date,
        required : true
    },
    roomId:{
        type:Schema.Types.ObjectId,
        required: true,
        ref:'Room',
    },
    by:{
        type:String,
        required:true
    }
})

const BookedRooms = models.BookedRooms || model('BookedRooms',BookedRoomsSchema)

export default BookedRooms