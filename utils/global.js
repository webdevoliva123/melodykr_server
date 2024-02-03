const ERRORLOGS = require("../models/error_logs/errorLogsModel")

exports.returnError = async (res,status, message = '', error = {}, data ) => {
    await ERRORLOGS.create({message, error})
    return res.status(status).json({
        success: false,
        message,
        error,
        data 
      });
} 