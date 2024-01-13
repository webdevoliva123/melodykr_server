const ADMINS = require("../../models/admins_modal/Admins");
const ARTICLE = require("../../models/article_model/Article");
const CONTENT_WRITER = require("../../models/content_writer_model/Content_Writers");
const { encryptPassword, decryptPassword } = require("../../utils/bycrypt");
const {
  genrateJWTToken,
  genrateJWTTokenOneTimeForAccount,
  verifyJWTTokenOneTimeForAccount,
} = require("../../utils/tokens");
const moment = require('moment');

exports.createAdmins = async (req, res) => {
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

    return res.status(201).json({
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
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error?.message,
    });
  }
};

exports.loginAdmins = async (req, res) => {
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
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error?.message,
    });
  }
};

exports.genrateMelodyModrator = async (req, res) => {
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
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error?.message,
    });
  }
};

exports.createMelodyModrator = async (req, res) => {
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
      password: await encryptPassword(otherData?.password),
    });

    return res.status(201).json({
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
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error?.message,
    });
  }
};

exports.createContentWriterAccountByNewsModerator = async (req, res) => {
  try {
    const {
      name,
      email,
      password: userPlainPassword,
      bio,
      twitterUrl,
      linkedinUrl,
      instagramUrl,
    } = req.body;
    const findThisContentWriter = await CONTENT_WRITER.findOne({
      email,
    });

    if (findThisContentWriter) {
      return res.status(500).json({
        success: false,
        message: "Content Writer Not Created Reated",
        error:
          "Looks like the email address already in use. Please, try with a different email address",
      });
    }

    await CONTENT_WRITER.create({
      name,
      email,
      password: await encryptPassword(userPlainPassword),
      bio,
      socialMedia: {
        twitter: twitterUrl,
        linkedin: linkedinUrl,
        instagram: instagramUrl,
      },
    })
      .then((data) => {
        const { password: resposnePassword, ...otherData } = data?._doc;
        return res.status(201).json({
          success: false,
          message: "Content Writer Created Successfully",
          data: {
            ...otherData,
            password: userPlainPassword,
          },
        });
      })
      .catch((error) => {
        return res.status(500).json({
          success: false,
          message: "Something went wrong",
          error: error?.message,
        });
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error?.message,
    });
  }
};

// exports.getUpdateSechma = async (req, res) => {
//   try {
//     ARTICLE.updateMany({}, { $set: { isVideoInclude: false } })
//       .then((response) => {
//         return res.status(200).json({
//           success: true,
//           message: "Schema updated",
//           data: response,
//         });
//       })
//       .catch((error) => {
//         return res.status(400).json({
//           success: false,
//           message: "Error while updating",
//           error: error.message,
//         });
//       });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Something went wrong ",
//       error: error.message,
//     });
//   }
// };
