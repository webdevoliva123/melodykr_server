require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongo_config = require('./configs/mongoconfig')

// config
app.use(express.json())
app.use(bodyParser.urlencoded({extended:false}))


// import routes
const AdminsRoutes = require('./router/accounts_router/Admins_Routes')
app.use('/api/v1/melody',AdminsRoutes)



// mongo connection
mongo_config()

module.exports = app