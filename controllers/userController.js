import User from "../models/userModel.js";
import Image from "../models/imageModel.js";

export const updateUser = async (req, res) => {
  try {
    const user = req.user;
    const usr = req.params.username;
    const account = await User.findOne({ username: usr });
    if (usr === user.username) {
      if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 12);
      }
      try {
        await account.updateOne({ $set: req.body, profile_pic: req.file.originalname });
        res.status(200).json({ message: `User updated successfully` });
      } catch (error) {
        res.status(500).json({ error: `User update failed` });
      }
    } else {
      return res.status(404).json({ error: `Invalid Access` });
    }
  } catch (error) {
    return res.status(500).json({ error: `Internal Server Error` });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = req.user;
    const usr = req.params.username;
    const account = await User.findOne({ username: usr });
    if (usr === user.username || account.isAdmin) {
      try {
        await account.deleteOne();
        res.status(200).json({ message: `User deleted successfully` });
      } catch (error) {
        return res.status(500).json({ error: `Internal Server Error` });
      }
    } else {
      return res.status(404).json({ message: `Invalid Access` });
    }
  } catch (error) {
    return res.status(500).json({ error: `Internal Server Error` });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = req.user;
    const usrNm = await User.findOne({_id: user._id})
    const usr = req.params.username;
    if (usr === usrNm.username || user.isAdmin) {
      try {
        const account = await User.findOne({ username: usr });
        const images = await Image.findOne({ author: req.user });
        res.status(200).json(account);
      } catch (error) {
        return res.status(500).json({ error: `Internal Server Error` });
      }
    } else {
      return res.status(404).json({ error: `Invalid Access` });
    }
  } catch (error) {
    return res.status(500).json({ error: `Internal Server Error` });
  }
};

export const getUsers = async (req, res) => {
  try {
    const usr = await User.findOne(req.user);
    // if (usr.isAdmin) {
      try {
        const users = await User.find();
        res.status(200).json(users);
      } catch (error) {
        return res.status(500).json({ error: `Internal Server Error` });
      }
    // } else {
    //   return res.status(404).json({ error: `Invalid Access` });
    // }
  } catch (error) {
    return res.status(500).json({ error: `Internal Server Error` });
  }
};
