import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import sendEmail from "./sendMail.js";
import crypto from "crypto";

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
      return res.status(404).json({ message: `Please fill all fields` });
    }
    const oldEmail = await User.findOne({ email });
    if (oldEmail) {
      return res.status(404).json({ error: `Email already exists` });
    }
    const oldUsername = await User.findOne({ username });
    if (oldUsername) {
      return res.status(404).json({ error: `Username already exists` });
    }

    const newUser = await User.create({
      username,
      email,
      password,
    });
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.SECRET, {
      expiresIn: "1h",
    });
    res
      .status(200)
      .json({ message: `User Registration successful`, user, token });
  } catch (error) {
    res.status(500).json({ error: `Internal Server Error` });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ error: `Invalid Credentials` });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(404).json({ error: `Invalid Credentials` });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET, {
      expiresIn: "1000d",
    });
    res.cookie("token", token, {
      expires: new Date(Date.now() + 2589200000),
      httpOnly: true,
    });

    res.status(200).json({ message: `Login Success`, token, user});
  } catch (error) {
    res.status(500).json({ error: `Internal Server Error` });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: `User not found` });
    }
    const resetToken = await user.getResetPasswordToken();
    await user.save();
    const resetUrl = `${req.hostname}/password/reset/${resetToken}`;
    const message = `
      <h1>You have requested for a new password reset</h1>
      <p>Please go to this link to reset your password</p>
      <a href=${resetUrl} clicktracking = off>${resetUrl}</a>
      `;

    try {
      await sendEmail({
        to: user.email,
        subject: `Password Reset Email`,
        text: message,
      });
      res.status(200).json({ message: `Email Sent` });
    } catch (error) {
      res.status(500).json({ error: `Internal Server Error` });
    }
  } catch (error) {
    res.status(500).json({ error: `Internal Server Error` });
  }
};

export const resetPassword = async (req, res) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(404).json({ error: `Invalid Token` });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ message: `Password reset successful` });
  } catch (error) {
    res.status(500).json({ error: `Internal Server Error` });
  }
};
