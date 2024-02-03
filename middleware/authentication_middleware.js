const ADMINS = require("../models/admins_modal/Admins");
const CONTENT_WRITER = require("../models/content_writer_model/Content_Writers");
const { returnError } = require("../utils/global");
const { verifyJWTToken } = require("../utils/tokens");

exports.adminLoginAuthentication = async (req, res, next) => {
  try {
    const header = req?.headers?.authorization;

    if (!header) {
      return res.status(401).json({
        success: false,
        error: "You have no access to this page. no token",
      });
    }

    const token = header?.split(" ")[1];
    const verifyAdmin = await verifyJWTToken(token);

    if (!verifyAdmin) {
      return res.status(401).json({
        success: false,
        error: "You have no access to this page. invalid token",
      });
    }

    const findAdmin = await ADMINS.findById(verifyAdmin?.data?._id);

    if (!findAdmin) {
      return res.status(401).json({
        success: false,
        error: "You have no access to this page. no admin in database",
      });
    }

    const { id, name, role } = findAdmin;

    req.admin = {
      id:_id,
      name,
      role,
    };

    return next();
  } catch (error) {
    return returnError(res,500,"Something went wrong",error?.message)
    
  }
};

exports.adminRoleAuthentication = (roles) => {
  return (req, res, next) => {
    if (!req?.admin) {
      return res.status(401).json({
        success: false,
        error: "You have no access to this page. no admin",
      });
    }

    const { role } = req?.admin;

    if (!roles.includes(role)) {
      return res.status(401).json({
        success: false,
        error: "You have no access to this page. not role type",
      });
    }

    next();
  };
};

exports.contentWriterLoginAuthentication = async (req,res,next) => {
    try {
        const header = req?.headers?.authorization;
    
        if (!header) {
          return res.status(401).json({
            success: false,
            error: "You have no access to this page. no token",
          });
        }
    
        const token = header?.split(" ")[1];
        const verifyContentWriter = await verifyJWTToken(token);
    
        if (!verifyContentWriter) {
          return res.status(401).json({
            success: false,
            error: "You have no access to this page. invalid token",
          });
        }
    
        const findContentWriter = await CONTENT_WRITER.findById(verifyContentWriter?.data?._id);
    
        if (!findContentWriter) {
          return res.status(401).json({
            success: false,
            error: "You have no access to this page. no admin in database",
          });
        }
    
        const { _id, name, email } = findContentWriter;
    
        req.contentWriter = {
          _id,
          name,
          email,
        };
    
        return next();
      } catch (error) {
        return returnError(res,500,"Something went wrong",error?.message)
      }
}