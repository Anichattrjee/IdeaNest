import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const testController = (req, res) => {
  res.json({ message: "Api is working" });
};

export const updateUser = async (req, res, next) => {
  console.log(req.user);
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "Not allowed to update this user"));
  }
  if (req.body.username) {
    if (req.body.username.includes(" ")) {
      return next(errorHandler(400, "Username cannot contain spaces"));
    }
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      return next(errorHandler(400, "Username must be within 7 to 20 chars"));
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(errorHandler(400, "Username can only contain lowercase"));
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, "Username can only contain letters and numbers")
      );
    }
  }
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(errorHandler(400, "Password must be at least 6 characters"));
    }
    req.body.password = await bcryptjs.hash(req.body.password, 10);
  }

  try {
    //update the user
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          profilePicture: req.body.profilePicture,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;
    res
      .status(200)
      .json({ message: "User successfully updated", success: true, rest });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  console.log(req.user.id);
  console.log(req.params.userId);
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(400, "Not allowed to delete the user"));
  }
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.userId);
    res.status(200).json({ message: "User has been deleted", success: true });
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json({ message: "User has been signed out", success: true });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    next(errorHandler(403, "You are not allowed to see all users"));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limi) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const users = await User.find({})
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    //   .select("-password");

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments();

    const now=new Date();
    
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthUsers=await User.countDocuments({
        createdAt:{$gte:oneMonthAgo}
    });

    res.status(200).json({
        users:usersWithoutPassword,
        totalUsers,
        lastMonthUsers
    });

  } catch (error) {
    next(error);
  }
};
