const ADMINS = require("../models/admins_modal/Admins");
const { verifyJWTToken } = require("../utils/tokens");

const adminLoginAuthentication = async (req, res, next) => {
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
      id,
      name,
      role,
    };

    return next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error?.message,
    });
  }
};

const adminRoleAuthentication = (roles) => {
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

module.exports = { adminLoginAuthentication, adminRoleAuthentication };
