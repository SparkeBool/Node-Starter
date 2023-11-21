const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

function genJWT(payload){
    const token = jwt.sign(payload, JWT_SECRET,{
        expiresIn: "1h"
      });

      return token;

}

module.exports.genJWT = genJWT;