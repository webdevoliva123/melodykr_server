require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongo_config = require('./configs/mongoconfig')

// config
app.use(express.json())
app.use(bodyParser.urlencoded({extended:false}))


// import routes -  admin routes
const AdminsRoutes = require('./routes/admin_routes/Admins_Routes')
app.use('/api/v1/melody',AdminsRoutes)

// import routes -  content writer routes
const ContentWriterRoutes = require('./routes/content_writer_routes/Content_Writer_Routes')
app.use('/api/v1/melody',ContentWriterRoutes)




// mongo connection
mongo_config()

module.exports = app