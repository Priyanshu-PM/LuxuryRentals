const User = require('../models/User.modal')
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');


const signup = catchAsyncErrors( async  (req, res, next) => {

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
});

const signin = catchAsyncErrors( async (req, res, next) => {
    const { email, password } = req.body;
    try {

        const validUser = await User.findOne({email});
        if(!validUser) {
            return res.status(401).json({ success: false, message: "User not found" });
        }

        const isMatched = validUser.comparePassword(password);

        // const isMatched = bcryptjs.compareSync(password, validUser.password);
        
        if(!isMatched) {
            return res.status(401).json({success: false, message: "Wrong password"});
        }

        // const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET)
        // res.cookie('access_token', token, {httpOnly: true }).status(200).json(validUser);

        const token = validUser.generateJWT();

        res.cookie('access_token', token, {httpOnly: true }).status(201).json({
          success: true,
          message: "Login successfully",
          data: { user: validUser, tokem: token },
        });
        
    } catch (error) {
        next(error);
    }
    

});


module.exports = { signup, signin };