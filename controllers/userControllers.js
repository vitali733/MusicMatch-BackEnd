const dotenv = require("dotenv")
dotenv.config();
const UserCollection = require("../models/userSchema");
const ErrorStatus = require("../utils/errorStatus");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getGeoLocationByPostalCode } = require("../utils/geoUtils");
const sendEmailVerificationLink = require("../utils/mailer");

const asyncHandler = require("express-async-handler");

/// LOGIN

const login = async (req, res, next) => {
  try {
    console.log("executing controller: login");
    const { email, password } = req.body;
    if (!email || !password) throw new ErrorStatus("missing login fields", 400);

    //.select('+password') is needed to get the field because in the userSchema it was defined with "select: false"
    const foundUser = await UserCollection.findOne({ email }).select(
      "+password"
    );
    if (!foundUser) throw new ErrorStatus("User not found", 404);

    const compare = await bcrypt.compare(password, foundUser.password);
    if (!compare) throw new ErrorStatus("password does not match", 401);

    const token = jwt.sign({ _id: foundUser._id }, process.env.JWT_SECRET);
    

    return res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 12,
        sameSite: "none",
        secure: true,
      })
      .sendStatus(200);
  } catch (error) {
    next(error);
  }
};

/// LOGOUT

const logout = (req, res, next) => {
  try {
    console.log("executing controller: logout");
    res
      .clearCookie("token", { path: "/", sameSite: "none", secure: true })
      .sendStatus(200)
      .send("logout successfull");
  } catch (error) {
    next(error);
  }
};

/// CREATE USER 


const createUser = async (req, res, next) => {
  try {
    const { email, password, firstName, postalCode, lastName } = req.body;

    if (!email || !password || !firstName || !postalCode)
      throw new ErrorStatus("missing fields", 400);

    const hash = await bcrypt.hash(password, 10);

    const { lat, lon } = await getGeoLocationByPostalCode(postalCode);
    console.log('API Response from getGeoLocationByPostalCode:', lat, lon);

    const { _id } = await UserCollection.create({
      email,
      password: hash,
      firstName,
      lastName,
      postalCode,
      latitude: lat,
      longitude: lon,
      verifiedEmail: false,
    });

    token = jwt.sign({ _id }, process.env.JWT_SECRET);
    console.log(token);
    
    await sendEmailVerificationLink(email, token);

    return res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 12,
        sameSite: "none",
        secure: true,
      })
      .sendStatus(201);
  } catch (error) {
    next(error);
  }
};

///// VERIFY USER EMAIL VIA USER TOKEN SENT TO EMAIL AS QUERY PARAMETER OF LINK TO /users/verify

const checkMailToken = async (req, res) => {
  const mailToken = req.query.token;
  console.log(mailToken)
  if (!mailToken) return res.sendStatus(401);

  try {
    // Verify the mailToken to get the user's _id
    const decodedToken = jwt.verify(mailToken, process.env.JWT_SECRET);
    
    // Find the user by _id
    const user = await UserCollection.findById(decodedToken._id);
  

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user's email is already verified
    if (user.verifiedEmail) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    // Update the user's email verification status
    user.verifiedEmail = true;
    await user.save();

    return res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};





///
const getLoggedInUser = async (req, res, next) => {
  try {
    console.log("executing controller: getLoggedInUser");
    const foundUser = await UserCollection.findById(req.userId);
    return res.status(200).json(foundUser);
  } catch (error) {
    next(error);
  }
};

///
const getUserById = async (req, res, next) => {
  try {
    console.log("executing controller: getUserById");
    const foundUser = await UserCollection.findById(req.params.id);
    return res.status(200).json(foundUser);
  } catch (error) {
    next(error);
  }
};

///
const getAllUsers = async (req, res, next) => {
  try {
    const allUsers = await UserCollection.find();
    return res.status(200).json(allUsers);
  } catch (error) {
    next(error);
  }
};

// allUsers for user search // don't find yourself: .find({ _id: { $ne: req.users._id } }) but can't access req.users._id right now might be auth issue
//api/user?search=...

//COMMENT VITALI: der controller name "allUsers" ist nicht sehr aussagekräftig, vll kann man das druch etwas aussagekräftigeres ersetzen?
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { firstName: { $regex: req.query.search, $options: "i" } },
          { lastName: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await UserCollection.find(keyword);
  res.send(users);
});

//
const updateUser = async (req, res, next) => {
  try {
    let {
      firstName,
      lastName,
      address,
      postalCode,
      latitude,
      longitude,
      imgUrl,
      userDescription,
      interests,
      skills,
      bookMarks,
      settings,
    } = req.body;

    // if no geodata get and write them from postalCode
    if ((!latitude || !longitude) && postalCode) {
      const { lat, lon } = await getGeoLocationByPostalCode(postalCode);
      latitude = lat;
      longitude = lon;
    }

    const { userId } = req;

    const updatedUser = await UserCollection.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        address,
        postalCode,
        latitude,
        longitude,
        imgUrl,
        userDescription,
        interests,
        skills,
        bookMarks,
        settings,
      },
      { new: true, runValidators: true }
    );

    return res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

const addSkinTerest = async (req, res, next) => {
  try {
    console.log("addSkinTerest fired");
    const { userId } = req;
    const { interest, skill, description, level } = req.body;
    if (!interest && !skill)
      throw new ErrorStatus("no interest or skill provided", 400);
    const { interests, skills } = await UserCollection.findById(req.userId);

    if (interest) {
      if (interests.some((i) => i.name === interest))
        throw new ErrorStatus("interest already exists", 400);

      interests.push({
        name: interest,
        description: description ? description : "",
      });

      const updatedUser = await UserCollection.findByIdAndUpdate(
        userId,
        {
          interests,
        },
        { new: true, runValidators: true }
      );

      return res.status(200).json(updatedUser);
    }

    if (skill) {
      if (skills.some((i) => i.name === skill))
        throw new ErrorStatus("skill already exists", 400);

      skills.push({
        name: skill,
        description: description ? description : "",
        level: level ? level : 1,
      });

      const updatedUser = await UserCollection.findByIdAndUpdate(
        userId,
        {
          skills,
        },
        { new: true, runValidators: true }
      );

      return res.status(200).json(updatedUser);
    }
  } catch (error) {
    next(error);
  }
};

const deleteSkinTerest = async (req, res, next) => {
  try {
    console.log("deleteSkinterest fired");
    const { userId } = req;
    const { interest, skill } = req.body;

    console.log("deleted skill: " + skill);

    if (!interest && !skill)
      throw new ErrorStatus("no interest or skill provided", 400);

    let { interests, skills } = await UserCollection.findById(req.userId);

    if (interest) {
      if (!interests.some((i) => i.name === interest))
        throw new ErrorStatus(
          "cant be deleted because interest does not exist",
          400
        );

      interests = interests.filter((i) => i.name !== interest);

      const updatedUser = await UserCollection.findByIdAndUpdate(
        userId,
        {
          interests,
        },
        { new: true, runValidators: true }
      );

      return res.status(200).json(updatedUser);
    }

    if (skill) {
      if (!skills.some((i) => i.name === skill))
        throw new ErrorStatus("skill already exists", 400);

      skills = skills.filter((i) => i.name !== skill);

      const updatedUser = await UserCollection.findByIdAndUpdate(
        userId,
        {
          skills,
        },
        { new: true, runValidators: true }
      );

      return res.status(200).json(updatedUser);
    }
  } catch (error) {
    next(error);
  }
};

//
const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req;
    const deletedUser = await UserCollection.findByIdAndDelete(userId);
    console.log("User has been deleted: " + userId);
    return res.json(deletedUser);
  } catch (error) {
    next(error);
  }
};

//
const getUsersAround = async (req, res, next) => {
  try {
    if (!req.usersAround)
      throw new ErrorStatus("could not find users around", 500);
    return res.json(req.usersAround);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  checkMailToken,
  getLoggedInUser,
  login,
  updateUser,
  deleteUser,
  logout,
  getAllUsers,
  allUsers,
  getUserById,
  getUsersAround,
  addSkinTerest,
  deleteSkinTerest,
};

