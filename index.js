const dotenv = require("dotenv");
const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./lib/db");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

dotenv.config();
const app = express();

if(!process.env.JWT_SECRET){
    throw new Error("JWT secret not defined");
}

//middleware
app.use(cookieParser(process.env.JWT));
app.use(express.json());



//Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);



//port setting
 const port = process.env.PORT || 5000;

 //database connect
connectDB();

app.listen(port, () => console.log(`Server running on port ${port}`));