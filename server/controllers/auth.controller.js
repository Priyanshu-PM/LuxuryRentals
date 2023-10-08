const User = require('../models/User.modal')
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');


const signup = async  (req, res, next) => {

    // console.log("Request has arrived !!");
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
        next(error);
    }
};

const signin = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const validUser = await User.findOne({email});
        if(!validUser) {
            return res.status(401).json({ success: false, message: "User not found" });
        }
        const isMatched = await validUser.comparePassword(password);
        console.log("Matched is : ", isMatched);

        // const isMatched = bcryptjs.compareSync(password, validUser.password);
        
        if(!isMatched) {
            return res.status(401).json({success: false, message: "Wrong password"});
        }

        // const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET)
        // res.cookie('access_token', token, {httpOnly: true }).status(200).json(validUser);

        const token = validUser.generateJWT();

        // destructuring the password and other information
        const { password: pass, ...userInfo } = validUser._doc;

        res.cookie('access_token', token, {httpOnly: true }).status(200).json({
          success: true,
          message: "Login successfully",
          data: { user: userInfo, tokem: token },
        });
        
    } catch (error) {
        next(error);
    }
    

};

module.exports = { signup, signin };