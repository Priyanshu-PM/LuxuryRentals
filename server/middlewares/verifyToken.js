const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {

    const token = req.cookies.access_token;
    if (!token) {
        return res
          .status(401)
          .json({
            success: false,
            message: "Unauthorized, Please provide authorization token if not token.",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if(err) return res.status(401).json({
              success: false,
              message: "Unauthorized, Please provide authorization token not verify.",
          });

          req.user = user;
          next();
        });
    } catch (err) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized, Please provide authorization token error catch.",
        });
    }
};

module.exports = { verifyToken };