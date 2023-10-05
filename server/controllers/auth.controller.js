const User = require('../models/User.modal')
const bcryptjs = require('bcryptjs');

const signup = async  (req, res) => {
    console.log("Request has arrived !!");
    console.log(req.body);
    const {username, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({
        username, 
        email, 
        password: hashedPassword
    });
    try {
        await newUser.save();
        res.status(201).json({"message" : "User created successfully"});
        
    } catch (error) {
        res.status(500).json(error.message);
        
    }
}

module.exports = { signup };