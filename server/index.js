const express = require('express');
const mongoose = require('mongoose');
const errorMiddleware = require("./middlewares/error");

const userRouter =  require('./routes/user.route');
const authRouter = require('./routes/auth.route');
const listingRouter = require('./routes/listing.route');

require("dotenv").config();

const cookieParser = require('cookie-parser');
const path = require('path');

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("connected to mongo db");
} ).catch((err) => {
    console.log(err);
})

const __variableOfChoice = path.resolve();

const app = express();

app.use(express.json());
app.use(cookieParser());

const PORT = 3000;


app.listen(PORT, () => {
    console.log("Server running on port : ", PORT);
})

// user routes
app.use("/api/user", userRouter);
// authentication routes
app.use("/api/auth", authRouter);
// listing routes
app.use('/api/listing', listingRouter);

app.use(express.static(path.join(__variableOfChoice, '/client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__variableOfChoice, 'client','dist','index.html'));
})

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


