const jwt = require('jsonwebtoken')

const genrateJWTToken = async (data,exp = '1 days') => {
    return await jwt.sign({data},process.env.JWT_SECRET_KEY,{expiresIn : exp})
} 


const verifyJWTToken = async (token) => {
    return await jwt.verify(token,process.env.JWT_SECRET_KEY)
}

const genrateJWTTokenOneTimeForAccount = async (data) => {
    return await jwt.sign(data,process.env.JWT_SECRET_KEY,{ expiresIn: '15m' })
}

const verifyJWTTokenOneTimeForAccount = async (token) => {
   return await jwt.verify(token,process.env.JWT_SECRET_KEY,(err, decoded) => {
        if (err) {
            return {success : false,message : 'Invalid token or token has been expired'}
          }

          return {
            success : true,
            message : 'Token has been verified',
            data : decoded
          }
          
    })
}


module.exports = {genrateJWTToken,verifyJWTToken,genrateJWTTokenOneTimeForAccount,verifyJWTTokenOneTimeForAccount}