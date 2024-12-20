import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";
dotenv.config({
    path:"C:\Users\pnsha\OneDrive\Desktop\Docbot\.env"
})
connectDB()//promise will be returned
.then(()=>{
    app.listen(process.env.port|| 3001,()=>{
        console.log(`server is running at port :${process.env.port}`);//if promise is resolved
    })
})
.catch((err)=>{
    console.log("MONGODB connection failed !!!",err);//if promise is not resolved
})

