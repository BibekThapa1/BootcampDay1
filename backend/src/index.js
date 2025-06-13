import dotenv from "dotenv"
import {app} from "./app.js"
import connectDB from "./db/index.js"
import seedAdmin from "./utils/seedAdmin.js"

dotenv.config({})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is running at port: ${process.env.PORT}`)
    });
    app.on("error",(error)=>{
        console.log("Express connection error",error);
    })
})
.catch((error)=>{
    console.log("MongoDb connection failed",error);
})

