const bcryptjs = require("bcryptjs");

const {validateSignin, validateSignup} = require("../lib/validations/userValidation");

const User = require("../model/User");
const { genJWT } = require("../lib/helpers/jwt");
const generateUniqueChars = require("../lib/utils");
const {sendActivationLink} = require("../lib/nodemailer/activationEmail");


// @description: User signin
// @Method: POST
// @Endpoint: api/users/signin
// @AccessType: public

const signin = async (req, res) =>{
    //validation}
    const error = await validateSignin(req.body);

    if (error) {
        return res.status(400).json({ msg: error });
      }


      const {email, password} = req.body;

      // check email is in account
      const user = await User.findOne({email});
      if(!user){
        return res.status(400).json({msg: "invalid email or password"});
      }

      // check password match
      const passwordMatch = await bcryptjs.compare(password, user.password);
      if(!passwordMatch){
        return res.status(400).json({msg: "invalid email or password"});
      }


        if(!user.isActivate){
          const activationToken = generateUniqueChars(80);
          const activationTokenExpires = Date.now() + 20 * 60 * 1000;

          user.activationToken = activationToken;
          user.activationTokenExpires = activationTokenExpires;
          lastName = user.lastName;
          
          await user.save();

          try{
            await sendActivationLink({ email, lastName, activationToken });
          }catch(error){
            console.error(error);
          }
        return res.status(400).json({msg: `Activate your account. An Activation Email as been sent to ${user.email}`});

        }
      //setting cookie

      const payload = {
        _id: user._id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`
      }
      let isSecureCookie = false ; // only in dev in prod should be true
      let sameSiteCookie = "lax"; //lax, true, false or strict
     
      //checking if environment is production
      if (process.env.NODE_ENV === "production") {
        isSecureCookie = true;
        sameSiteCookie = "None";
      }

      const token = genJWT(payload);
      const oneDay = 1000 * 60 * 60 * 24; // 24 hrs
      //settting cookie
      res.cookie("accessToken", token, {
        httpOnly: true,
        secure: isSecureCookie,
        signed: true,
        expires: new Date(Date.now() + oneDay),
        sameSite:sameSiteCookie
        });
     
      

      res.json({msg: "Login Successful"});
}

const signup = async (req, res) =>{
    //validation}
    const error = await validateSignup(req.body);

    if (error) {
        return res.status(400).json({ msg: error });
      }

      const { firstName, lastName, phone, email, password} = req.body;

      //check phone number exist
      //check phone number exist
      const phoneExist = await User.findOne({phone});
      if(phoneExist){
        return res.status(400).json({msg: "Phone number Already Exist"});
      }

      const emailExist = await User.findOne({email});
      if(emailExist){
        return res.status(400).json({msg: "Email Already Exist"});
      }

      //Hash the pasword install bcryptjs

      const salt = await bcryptjs.genSalt(10);

      const hashedPassword = await bcryptjs.hash(password, salt);

      // create a user
      const newUser = new User({
        firstName,
        lastName,
       phone,
       email,
       password: hashedPassword,
       avatar: null
      });
          
         
  const activationToken = generateUniqueChars(80);
  const activationTokenExpires = Date.now() + 20 * 60 * 1000;

  newUser.activationToken = activationToken;
  newUser.activationTokenExpires = activationTokenExpires;

  await newUser.save();
    
      const user = {
        firstName: newUser.firstName,
        lastName: newUser.lastName
      }

      res.status(201).json({ msg: "Sign up successful! an Activation Email has been sent to your mail" });

    try{
      await sendActivationLink({ email, lastName, activationToken });
    }catch(error){
      console.error(error);
    }

    
    //   res.json({newUser});
}

// @description: User activate
// @Method: GET
// @Endpoint: api/auth/activate/:activationToken
// @AccessType: public
const activate = async (req, res) => {
  const activationToken = req.params.activationToken;

  const user = await User.findOne({ activationToken });
  if (!user) {
    return res.status(400).json({ msg: "Invalid activation token" });
  }

  if (Date.now() > user.activationTokenExpires) {
    return res.status(400).json({ msg: "Activation token expired" });
    user.activationToken = undefined;
    user.activationTokenExpires = undefined;
  }

  user.isActivate = true;
  user.activationToken = undefined;
  user.activationTokenExpires = undefined;

  await user.save();

  res.status(200).json({ msg: "Account activated successfully" });
  
};

module.exports.signin = signin;
module.exports.signup = signup;
module.exports.activate = activate;


/**
 * on signin, check if the user is activated, 
 * send activation link and message that a link has been sent to your account
 */