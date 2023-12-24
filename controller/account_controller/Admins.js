const ADMINS = require("../../models/accounts/Admins");
const { encryptPassword, decryptPassword } = require("../../utils/bycrypt");
const {
  genrateJWTToken,
  genrateJWTTokenOneTimeForAccount,
  verifyJWTTokenOneTimeForAccount,
} = require("../../utils/tokens");

const createAdmins = async (req, res) => {
  try {
    const findThisAdmin = await ADMINS.findOne({ email: req.body.email });

    if (findThisAdmin) {
      return res.status(400).json({
        success: false,
        message: "Role Not Created",
        error: "This email is already in use.",
      });
    }

    const { password, ...otherRequest } = req.body;

    const response = await ADMINS.create({
      password: await encryptPassword(password),
      ...otherRequest,
      role: "Technical_Heads",
    });

    return res.status(200).json({
      success: true,
      message: "Role Created",
      data: response,
      token: await genrateJWTToken({
        _id: response?._id,
        email: response?.email,
        role: "Technical_Heads",
      }),
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      message: "Something went wrong",
      error: error?.message,
    });
  }
};

const loginAdmins = async (req, res) => {
  try {
    const findThisAdmin = await ADMINS.findOne({ email: req.body.email });

    if (!findThisAdmin) {
      return res.status(404).json({
        success: false,
        message: "Error while logging",
        error:
          "Invalid admin email address or password, please re-check your credentials. ",
      });
    }

    const isPasswordCorrect = await decryptPassword(
      req?.body?.password,
      findThisAdmin?.password
    );

    if (!isPasswordCorrect) {
      return res.status(404).json({
        success: false,
        message: "Error while logging",
        error:
          "Invalid admin email address or password, please re-check your credentials. ",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Admin logged in successfully",
      data: findThisAdmin,
      token: await genrateJWTToken({
        _id: findThisAdmin?._id,
        email: findThisAdmin?.email,
        role: findThisAdmin?.role,
      }),
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      message: "Something went wrong",
      error: error?.message,
    });
  }
};

const genrateMelodyModrator = async (req, res) => {
  try {
    const findThisAdmin = await ADMINS.findOne({ email: req.body.email });

    if (findThisAdmin) {
      return res.status(400).json({
        success: false,
        message: "Token Not Generated",
        error: "This email is already in use.",
      });
    }

    const genratedToken = await genrateJWTTokenOneTimeForAccount({
      email: req?.body?.email,
      role: req?.body?.role,
    });

    return res.status(200).json({
      success: true,
      message: "Token Generated",
      token: genratedToken,
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      message: "Something went wrong",
      error: error?.message,
    });
  }
};

const createMelodyModrator = async (req, res) => {
  try {
    const { token, ...otherData } = req.body;
    const isTokenVerified = await verifyJWTTokenOneTimeForAccount(token);

    if (!isTokenVerified?.success) {
      return res.status(400).json({
        success: false,
        message: "Role Not Created",
        error: isTokenVerified?.message,
      });
    }

    const findThisAdmin = await ADMINS.findOne({
      email: isTokenVerified.data.email,
    });

    if (findThisAdmin) {
      return res.status(400).json({
        success: false,
        message: "Role Not Created",
        error: "Looks like this email is already in use",
      });
    }

    const response = await ADMINS.create({
        ...isTokenVerified?.data,
        name: otherData?.name,
        password : await encryptPassword(otherData?.password)
      });

      return res.status(200).json({
        success: true,
        message: "Role Created",
        data: response,
        token: await genrateJWTToken({
          _id: response?._id,
          email: response?.email,
          role: response?.role,
        }),
      });


  } catch (error) {
    return res.status(200).json({
      success: false,
      message: "Something went wrong",
      error: error?.message,
    });
  }
};

const createContentWriterAccountByNewsModerator = async (req,res) => {
    
}

module.exports = {
  createAdmins,
  loginAdmins,
  genrateMelodyModrator,
  createMelodyModrator,
};
