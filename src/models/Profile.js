import mongoose from "mongoose";

const {Schema}  = mongoose

const  profileSchema = new Schema({  
    name:{
        type: String,
        required: true,
        trim:true,
        minLength:2,
        maxLength:50
    },
    timezone:{
        type:String,
        required:true,
        default:"America/NewYrk",
    },
    isActive:{
        type:Boolean,
        default:true
    },
},
{
    timestamps:true
} );

profileSchema.index({name:1})

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;
