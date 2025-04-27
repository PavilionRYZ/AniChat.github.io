const express = require("express");
const dotenv = require('dotenv');
const dataBase = require('./config/db');
const cors = require('cors');
const cookieParser = require('cookie-parser');


dotenv.config();
dataBase();

const app = express();
app.use(cookieParser());
app.use(cors(
    {
        origin: process.env.FRONTEND_URL,
        credentials: true,
    }
));

//<------- uncaught ref err ------->

process.on("uncaughtException", (err) => {
    console.log("Server is closing due to uncaughtException");
    console.log(`Error: ${err.message}`);
    process.exit(1);
})

// <------- end of uncaught ref err ------->

//Routes
const userRoute = require('./routes/userRoutes');
const messageRoute = require('./routes/messageRoutes');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", userRoute);
app.use("/api/v1", messageRoute);



//Global Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Unhandled promise rejection

process.on("unhandledRejection", (err) => {
    console.log("Server is closing due to unhandledRejection");
    console.log(`Error: ${err.message}`);

    server.close(() => {
        process.exit(1);
    });

})