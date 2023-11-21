const dotenv = require("dotenv");
const express = require("express");
const connectDB = require("./lib/db");
const authRoutes = require("./routes/auth");

dotenv.config();

const app = express();

if(!process.env.JWT_SECRET){
    throw new Error("JWT secret not defined");
}

//middleware
app.use(express.json());



//Routes
app.use("/api/auth", authRoutes);


//port setting
 const port = process.env.PORT || 5000;

 //database connect
connectDB();

app.listen(port, () => console.log(`Server running on port ${port}`));