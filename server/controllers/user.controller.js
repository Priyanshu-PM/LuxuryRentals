const bcryptjs = require('bcryptjs');
const User = require('../models/User.modal')

const test = (req, res) => {
    res.json({
        "message": "Hello from backend"
    });
};

const updateUser = async (req, res, next) => {

        if(req.user.id !== req.params.id)   return res.status(401).json({
            success: false,
            message: "Unauthorized, Please provide authorization token from update user.",
        });
        try {
            if(req.body.password) {
                req.body.password = bcryptjs.hashSync(req.body.password, 10);
            }

            const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    avatar: req.body.avatar,
                }
            }, {new: true}) 

            const {password, ...userInfo} = updatedUser._doc;
            res.status(200).json({
                success: true,
                message: "updated successfully",
                data: { user: userInfo},
              });

        } catch (error) {

            next(error);
        }
};

const deleteUser = async (req, res, next) => {

    if(req.user.id !== req.params.id)   return res.status(401).json({
        success: false,
        message: "Unauthorized, Please provide authorization token from update user.",
    });

    try {

        await User.findByIdAndDelete(req.params.id);

        res.clearCookie('access_token');
        return res.status(200).json({
            success: true,
            message: "User has been deleted",
        });

    } catch (error) {

        next(error);
    }
    

};

module.exports = {
    test, 
    updateUser, 
    deleteUser 
};