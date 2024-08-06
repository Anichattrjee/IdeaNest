import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signUp = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (
      !username ||
      !email ||
      !password ||
      username === "" ||
      email === "" ||
      password === ""
    ) {
      next(errorHandler(400, "All fields are required"));
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    const result = await user.save();

    res.status(200).json({ message: "User registered", success: true });
  } catch (error) {
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password || email === "" || password === "") {
      return next(errorHandler(400, "Email & Password is required"));
    }

    const validUser = await User.findOne({ email });

    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }

    const validPassword = await bcryptjs.compare(password, validUser.password);

    if (!validPassword) {
      return next(errorHandler(400, "Invalid Password"));
    }

    const token = await jwt.sign({ id: validUser._id, isAdmin:validUser.isAdmin }, process.env.JWT_SECRET);

    //separarte the password and then send it back
    const { password: pass, ...rest } = validUser._doc;

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json({ message: "Sign-In Successful", success: true, rest });
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  console.log(googlePhotoUrl);
  try {
    //check if the user exists or not
    const user = await User.findOne({ email });

    //if yes then generate token for the user
    if (user) {
      const token = await jwt.sign({ id: user._id,isAdmin:user.isAdmin }, process.env.JWT_SECRET);
      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json({ message: "Sign-In Successful", success: true, rest });
    }
    //else create a new user and sign him up
    else{
      const generatePassword=Math.random().toString(36).slice(-8);
      const hashedPassword=await bcryptjs.hash(generatePassword,10);

      const newUser=new User({
        username:name.toLowerCase().split(' ').join('')+ Math.random().toString(9).slice(-4),
        email,
        password:hashedPassword,
        profilePicture:googlePhotoUrl,
      });

      const savedNewUser=await newUser.save();
      const token=await jwt.sign({id:savedNewUser._id, idAdmin:savedNewUser.isAdmin},process.env.JWT_SECRET);
      const {password, ...rest}=savedNewUser._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json({ message: "Sign-In Successful", success: true, rest });

    }
  } catch (error) {
    next(error);
  }
};
