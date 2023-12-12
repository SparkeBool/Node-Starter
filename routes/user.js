const express = require("express");
const { getAllUsers, getUser, updateUser } = require("../controllers/userController");
const {isLogin} = require("../middleware/authMiddleware");


const router = express.Router();


router.get("/", isLogin, getAllUsers);
router.get("/:id", isLogin, getUser);
router.put("/:id", isLogin, updateUser);


module.exports = router;