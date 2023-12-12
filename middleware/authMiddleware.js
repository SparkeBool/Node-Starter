const jwt = require('jsonwebtoken');
const User = require('../model/User');


const jwtSecret = process.env.JWT_SECRET;

const isLogin = async (req, res, next) => {
  const { accessToken } = req.signedCookies;

  if (accessToken) {
    try {
      const payload = jwt.verify(accessToken, jwtSecret);

      req.user = await User.findById(payload._id).select("-password");
      if (!req.user) {
        throw new Error("Invalid user account");
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ msg: "Please login to continue" });
    }
  } else {
    res.status(401).json({ msg: "Please login to continue" });
  }
};

const isAdmin = async (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({ msg: "Unauthorized" });
  }
};

module.exports.isLogin = isLogin;
module.exports.isAdmin = isAdmin;
