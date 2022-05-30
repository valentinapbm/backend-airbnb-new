const {Schema, model, models}= require("mongoose");

const emailRegex = new RegExp("[a-z0-9._-]*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?[.])+[a-z0-9]{2,}");
const nameRegex = new RegExp("(?:[a-zA-Z](?:[a-zA-Z]*[a-zA-Z]+$)+$)+$");
const birthdayRegex= new RegExp("[0-9]{2}[\/]{1}[0-9]{2}[\/]{1}[0-9]{4}$");
const phoneRegex = new RegExp("[+][0-9 _]*[0-9][0-9 _]{11}$");
const passRegex = new RegExp("(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$");
const commentRegex = new RegExp("[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$");
const userSchema = new Schema(
    {
        rol:{
            type:String,
            required:true,
            enum:{
                values:["host","guest","admin"],
                message: "invalid rol",
            }
        },
        name:{
            type:String,
            required:true,
            match:[nameRegex, "name must contain only letters"],
            minlength:[2, "name too short"],
            maxlength:[10, "name too long"],
        },
        lastname:{
            type:String,
            required:true,
            match:[nameRegex, "lastname must contain only letters"],
            minlength:[2, "lastname too short"],
            maxlength:[10, "name too long"],
        },
        email:{
            type:String,
            required:true,
            match: [emailRegex, "invalid email"],
            validate: [{
                validator(value){
                    return models.User.findOne({email:value})
                    .then((user)=>!user)
                    .catch(()=>false)
                },
            message:"email already exist",
            }]
        },
        birthday:{
            type:String,
            required:true,
            match: [birthdayRegex, "invalid birthday"],

        },
        password:{
            type:String,
            required:true,
            minlength: [8, "password too short"],
            match:[passRegex, "your password is not secure"],
        },
        phone:{
            type:String,
            required: true,
            match: [phoneRegex, "your phone number shouldn't contain letters"],
            validate: [{
                validator(value){
                    return models.User.findOne({phone:value})
                    .then((user)=>!user)
                    .catch(()=>false)
                },
            message:"phone already exist",
            }]
            
        },
        description:{
            type: String,
            maxlength:[100, "too long description"],
            match: [commentRegex, "invalid comment"]
        },
        image:{
            type:String
        }
        
    }, { timestamps: true }
);
const User = model("User", userSchema);
module.exports=User;