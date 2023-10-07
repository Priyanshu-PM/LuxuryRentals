const express = require('express');
const mongoose = require('mongoose');
require("dotenv").config();
const errorMiddleware = require("./middlewares/error");

const userRouter =  require('./routes/user.route');
const authRouter = require('./routes/auth.route')
mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("connected to mongo db");
} ).catch((err) => {
    console.log(err);
})

const app = express();
app.use(express.json());

const PORT = 3000;


app.listen(PORT, () => {
    console.log("Server running on port : ", PORT);
})

// user routes
app.use("/api/user", userRouter);

// authentication routes
app.use("/api/auth", authRouter);

// middleware

app.use(errorMiddleware);

app.use((err, req, res, next) => {

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error";
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});


