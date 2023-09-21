import mongoose, { Schema} from "mongoose";


const NotesSchema = new Schema ({
    
    //geting the object id of the logged in user to fetch notes
    user:{ 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users'
         },
    Title:{
            type: String,
            required: true
         },
    Description:{
            type: String,
            required: true
         },
    Tag:{
            type: String,
            default: "General"
         },
    Date: {
        type: Date,
        default: Date.now
    }
    
})

const Notes = mongoose.model('Notes', NotesSchema)
export default Notes;