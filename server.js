const express = require("express");
const cors=require("cors");
const {connect} = require("./src/db");
const userRouter = require("./src/routes/user.routes");
const { use } = require("express/lib/application");


const port =8080;
const app = express();
connect();

app.use(express.json());
app.use(cors());


app.use("/users", userRouter);

app.listen(port, ()=>{
    console.log("App running OK");
});