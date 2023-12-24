const mongoose = require('mongoose')

const mongo_config = () => {
    mongoose.connect(process.env.MONGO_DATABASE_URI)?.then((res) => {
        return console.log(`Mongo Connected : ${res?.connection?.host}`)
    })?.catch((err) => {
        return console.log(`Mongoose Error : ${err}`)
    })
}


module.exports = mongo_config