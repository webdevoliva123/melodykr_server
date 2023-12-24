const bycrypt = require('bcrypt')

const encryptPassword = async (password) => {
    return await bycrypt.hash(password,Number(process.env.BYCRYPT_SALT_ROUND))
}

const decryptPassword = async (originalPassword,hashPassword) => {
    return await bycrypt.compare(originalPassword,hashPassword)
}

module.exports = {encryptPassword,decryptPassword}