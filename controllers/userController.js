const User = require("../model/User");
// @description: Get all users
// @Method: GET
// @Endpoint: api/users
// @AccessType: private
// @description: Get all users
// @Method: GET
// @Endpoint: api/users
// @AccessType: private
const getAllUsers = async (req, res) => {
  const users = await User.find({}).select("-password");

  res.status(200).json({ users });
};

// @description: Admin get user
// @Method: GET
// @Endpoint: api/users/:id
// @AccessType: private/admin
const adminGetUser = async (req, res) => {
  const id = req.params.id;

  const user = await User.findById(id).select("-password");
  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }

  res.status(200).json({ user });
};

// @description: User get profile
// @Method: GET
// @Endpoint: api/users/profile
// @AccessType: private
const getUser = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }

  res.status(200).json({ user });
};

// @description: Update profile
// @Method: PUT
// @Endpoint: api/users/:id
// @AccessType: private
const updateUser = async (req, res) => {
  const id = req.params.id;

  // validate the body of the req

  const { firstName, lastName } = req.body;

  if (req.user._id.toString() !== id) {
    return res.status(400).json({ msg: "Id do not match" });
  }

  // const user = await User.findById(id).select("-password");
  // if (!user) {
  //   return res.status(400).json({ msg: "Invalid user" });
  // }

  // user.firstName = firstName
  // user.lastName = lastName

  // await user.save()

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { firstName, lastName },
    { new: true }
  ).select("-password");
  if (!user) {
    return res.status(400).json({ msg: "Invalid user" });
  }

  res.status(200).json({ user, msg: "Updated successfully" });
};

// @description: Admin delete user account
// @Method: DELETE
// @Endpoint: api/users/:id
// @AccessType: private/admin
const adminDeleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.user._id);

  if (!user) {
    return res.status(400).json({ msg: "User doesn't exist" });
  }

  res.status(200).json({ msg: "User deleted" });
};
 module.exports.getUser = getUser;
 module.exports.getAllUsers = getAllUsers;
 module.exports.updateUser = updateUser;
 module.exports.adminGetUser = adminGetUser;
 module.exports.adminDeleteUser = adminDeleteUser;


  