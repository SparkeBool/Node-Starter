const yup = require("yup");
 

async function validateSignin(data){
    const schema = yup.object().shape({
        password:yup.string().required("Password is required"),
        email:yup.string().required().label("Email")
        
    });

    try{
        await schema.validate(data);
        return null
    }catch(error){
        console.error(error.errors[0]);
        return error.errors[0];
    }
}


async function validateSignup(data){

    const schema = yup.object().shape({
        firstName: yup.string().required().min(2).max(20).label("First Name"),
        lastName:  yup.string().required().min(2).max(20).label("Last Name"),
        phone: yup.string().required().min(11).max(12).label("Phone Number"),
        email: yup.string().required().email(),
        password: yup.string().required().min(8)

    });

    try{
        await schema.validate(data);
        return null
    }catch(error){
        console.error(error.errors[0]);
        return error.errors[0];
    }

}

module.exports.validateSignin = validateSignin;
module.exports.validateSignup = validateSignup;