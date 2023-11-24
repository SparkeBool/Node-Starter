const express = require("express");
const {signin, signup, activate} = require("../controllers/authController");



const router = express.Router();

router.post("/signin", signin);
router.post("/signup", signup);
router.get("/activate/:activationToken",activate);



module.exports = router;