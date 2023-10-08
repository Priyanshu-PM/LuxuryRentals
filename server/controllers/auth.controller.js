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

const google = async (req, res, next) => {

    try {
        
        const user = await User.findOne({email: req.body.email});
        if(user) {
            const token = user.generateJWT();

            const { password: pass, ...userInfo } = user._doc;

            res.cookie('access_token', token, {httpOnly: true }).status(200).json({
              success: true,
              message: "Login successfully",
              data: { user: userInfo, tokem: token },
            });
        } else {

            // generating the new password
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            
            const newUser = new User({
                username: req.body.name.split("").join("").toLowerCase() + Math.random().toString(36).slice(-4) , 
                email: req.body.email, 
                password: hashedPassword,
                avatar: req.body.photo
            }); 
        
            try {
                await newUser.save();
                const token = user.generateJWT();

            const { password: pass, ...userInfo } = user._doc;

            res.cookie('access_token', token, {httpOnly: true }).status(200).json({
              success: true,
              message: "Login successfully",
              data: { user: userInfo, tokem: token },
            });
                
            } catch (error) {
                next(error);
            }

        }

    } catch (error) {
        next(error);
    }

};

const signOut = async (req, res, next) => {

    try {
        res.clearCookie('access_token');
        res.status(200).json({
            success: true,
            message: "User has been logged out",
        });

    } catch (error) {
        next(error);
    }

};

module.exports = { 
    signup, 
    signin, 
    google, 
    signOut 
};