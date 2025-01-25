import { models, model, Schema } from "mongoose";

const DaySchema = new Schema({
    date:{
        type:Date,
        required : true
    },
    bookedRooms:[
        {
            room:{
                type:Schema.Types.ObjectId,
                ref:'Room',
                required: true
            },
            by:{
                type:String,
                required: true
            }
        }]
})

const Day = models.Day || model('Day',DaySchema)

export default Day