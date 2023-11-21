const crypto = require("crypto");

 function generateUniqueChars(length = 32) {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);
}

module.exports = generateUniqueChars;
