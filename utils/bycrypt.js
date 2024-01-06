const bycrypt = require('bcryptjs')

exports.encryptPassword = async (password) => {
    return await bycrypt.hash(password,Number(process.env.BYCRYPT_SALT_ROUND))
}

exports.decryptPassword = async (originalPassword,hashPassword) => {
    return await bycrypt.compare(originalPassword,hashPassword)
}
