const {Schema, model}= require("mongoose");

const userSchema = new Schema(
    {
        name:{
            type:String,
            required:true,
        },
        lastname:{
            type:String,
            required:true,
        },
        email:{
            type:String,
            required:true,
        },
        birthday:{
            type:String,
            required:true,
        },
        password:{
            type:String,
            required:true,
        }
        
    }
);
const User = model("User", userSchema);
module.exports=User;