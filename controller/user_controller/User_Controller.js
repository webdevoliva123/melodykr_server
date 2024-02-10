const USER = require("../../models/user_model/User_model")
const { returnError } = require("../../utils/global");
const { encryptPassword } = require("../../utils/bycrypt");
const { genrateJWTToken } = require("../../utils/tokens");
const { generateUsernameSuggestions } = require("../../utils/suggestUser");

const {jwtDecode} = require("jwt-decode")

// create user 
exports.createUserAccount = async (req,res) => {
    try {
    const {password,email,username,...otherInfo} = req.body

    const alreadyRegister = await USER.findOne({email})

    if(alreadyRegister){
        return returnError(res,401,"Something went wrong",`Account already registered. Try, another email address.`)
    }

    const alreadyAssignedUsername = await USER.findOne({username})


    if(alreadyAssignedUsername){
        return returnError(res,401,"Something went wrong",`Username already assigned. Try, another username.`,generateUsernameSuggestions(username))
    }

    const userCreated = await USER.create({
        ...otherInfo,
        password : await encryptPassword(password),
        email,
        username
    })

    
    if(userCreated){
        const {password : userCreatedPassword, ...otherUserCreatedInfo} = userCreated?._doc
        return res.status(201).json({
            success : true,
            data : otherUserCreatedInfo,
            message : "User created successfully",
            token : await genrateJWTToken({
                _id : userCreated?._id,
                username : userCreated?.username,
                email : userCreated?.email
            })
        })
    }

    } catch (error) {
        return returnError(res,500,"Something went wrong",error?.message)
    }
}

// continue with google 
exports.continueWithGoogle = async (req,res) => {
    try {
        const {token} = req.body
        const {name,email,picture} = jwtDecode(token);
       
    
        } catch (error) {
            return returnError(res,500,"Something went wrong",error?.message)
        }
}