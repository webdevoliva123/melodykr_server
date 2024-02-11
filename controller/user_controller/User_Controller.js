const USER = require("../../models/user_model/User_model");
const { returnError } = require("../../utils/global");
const { encryptPassword, decryptPassword } = require("../../utils/bycrypt");
const { genrateJWTToken } = require("../../utils/tokens");
// const { generateUsernameSuggestions } = require("../../utils/suggestUser");

const { jwtDecode } = require("jwt-decode");

// create user
exports.createUserAccount = async (req, res) => {
  try {
    const { password, email, username, ...otherInfo } = req.body;

    const alreadyRegister = await USER.findOne({ email });

    if (alreadyRegister) {
      return returnError(
        res,
        401,
        "Something went wrong",
        `Account already registered. Try, another email address.`
      );
    }

    const alreadyAssignedUsername = await USER.findOne({ username });

    if (alreadyAssignedUsername) {
      return returnError(
        res,
        401,
        "Something went wrong",
        `Username already assigned. Try, another username.`
      );
    }

    const userCreated = await USER.create({
      ...otherInfo,
      password: await encryptPassword(password),
      email,
      username,
    });

    if (userCreated) {
      const { password: userCreatedPassword, ...otherUserCreatedInfo } =
        userCreated?._doc;
      return res.status(201).json({
        success: true,
        data: otherUserCreatedInfo,
        message: "User created successfully",
        token: await genrateJWTToken({
          _id: userCreated?._id,
          username: userCreated?.username,
          email: userCreated?.email,
        }),
      });
    }
  } catch (error) {
    return returnError(res, 500, "Something went wrong", error?.message);
  }
};

// continue with google
exports.continueWithGoogle = async (req, res) => {
  try {
    const { token } = req.body;
    const { name, email, picture } = jwtDecode(token);

    const alreadyRegister = await USER.findOne({ email });

    if (alreadyRegister) {
      const { password: userCreatedPassword, ...otherUserCreatedInfo } =
        alreadyRegister?._doc;
      return res.status(201).json({
        success: true,
        data: otherUserCreatedInfo,
        message: "User Logged In successfully",
        token: await genrateJWTToken({
          _id: alreadyRegister?._id,
          username: alreadyRegister?.username,
          email: alreadyRegister?.email,
        }),
      });
    }

    let userNameCreated = "";
    let userNameAvailable = false;
    let count = 0;
    let randomNumber = "0";

    do {
      let username = `_${email?.split("@")[0]}${randomNumber}`;
      const findUsername = await USER.findOne({ username });

      if (!findUsername) {
        userNameCreated = username;
        userNameAvailable = true;
      }
      randomNumber = `${randomNumber}${count}`;
      count++;
    } while (!userNameAvailable);

    const userCreated = await USER.create({
      profileImage: picture,
      email,
      username: userNameCreated,
      fullName: name,
    });

    if (userCreated) {
      const { password: userCreatedPassword, ...otherUserCreatedInfo } =
        userCreated?._doc;
      return res.status(201).json({
        success: true,
        data: otherUserCreatedInfo,
        message: "User created successfully",
        token: await genrateJWTToken({
          _id: userCreated?._id,
          username: userCreated?.username,
          email: userCreated?.email,
        }),
      });
    }
  } catch (error) {
    return returnError(res, 500, "Something went wrong", error?.message);
  }
};

// login user
exports.loginUser = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    let isUserNameThere = false;
    let isEmailThere = false;

    const checkIsUsernameValid = await USER.findOne({
      username: emailOrUsername,
    });
    if (checkIsUsernameValid) {
      isUserNameThere = true;
    }

    const checkIsEmailValid = await USER.findOne({ email: emailOrUsername });
    if (checkIsEmailValid) {
      isEmailThere = true;
    }

    if (!isUserNameThere && !isEmailThere) {
      return returnError(
        res,
        401,
        "Something went wrong",
        "Invalid credentials. Please, try again"
      );
    }

    let userCrendentials = checkIsEmailValid || checkIsUsernameValid;

    let isPassowordValid = await decryptPassword(
      password,
      userCrendentials?.password
    );

    if (!isPassowordValid) {
      return returnError(
        res,
        401,
        "Something went wrong",
        "Invalid credentials. Please, try again"
      );
    }

    const { password: userCreatedPassword, ...otherUserCreatedInfo } =
      userCrendentials?._doc;
    return res.status(200).json({
      success: true,
      data: otherUserCreatedInfo,
      message: "User loggedin successfully",
      token: await genrateJWTToken({
        _id: userCrendentials?._id,
        username: userCrendentials?.username,
        email: userCrendentials?.email,
      }),
    });
  } catch (error) {
    return returnError(res, 500, "Something went wrong", error?.message);
  }
};
