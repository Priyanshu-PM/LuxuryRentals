const User = require('../models/User.modal')

const signup = async  (req, res) => {
    console.log("Request has arrived !!");
    console.log(req.body);
    const {username, email, password } = req.body;

    const newUser = new User({username, email, password});
    await newUser.save();
    res.status(201).json({"message" : "User created successfully"});
}

module.exports = { signup };