import mongoose from "mongoose";

const { Schema } = mongoose;

const UserModel = new Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required: function () {
            return !this.googleId;
        },
        select:false
    },
    googleId:{
        type:String,
        sparse:true,
        unique:true,
    },
    avatar:{
        type:String,
        default:"",
    },
    authProvider:{
        type:String,
        enum:["local", "google"],
        default:"local",
    },
    isAdmin:{
        type:Boolean,
        required:false,
        default:false,
    },
    balance:{
        type:Number,
        required:false,
        default:0,
    },
}, { timestamps: true });

const User = mongoose.model("User", UserModel);

export default User;