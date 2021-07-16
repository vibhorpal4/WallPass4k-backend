import Image from "../models/imageModel.js";
import User from "../models/userModel.js";
import Category from "../models/categoryModel.js";


export const uploadImage = async (req, res) => {
  const { title, category, tags } = req.body;
  try {
    if (!title) {
      return res.status(404).json({ error: `Please enter Image title` });
    }

    if (!category) {
      return res.status(404).json({ error: `Please Enter Category` });
    }
    const isCategory = await Category.findOne({ title: category });
    const user = await User.findById(req.user._id).select("-password");
    if (!isCategory) {
      return res.status(404).json({ error: `Category not found` });
    }
    const newImage = await Image.create({
      title,
      image: req.file.originalname,
      category: isCategory.title,
      tags,
      author: user.username,
    });
    console.log(newImage);
    const img = await newImage.save();
    await user.updateOne({ $push: { image: img } });
    await isCategory.updateOne({ $push: { image: img } });
    res.status(200).json({ img });
  } catch (error) {
    return res.status(500).json({ error: `Internal Server Error` });
  }
};

export const deleteImage = async (req, res) => {
  try {
    const usr = req.user;
    const user = await User.findOne({ _id: usr });
    const image = await Image.findOne({ slug: req.params.slug });
    const category = await Category.findOne({ _id: image.category });
    const imageAuthor = image.author;
    if (user === imageAuthor || user.isAdmin) {
      try {
        await user.updateOne({ $pull: { image: image._id } });
        await category.updateOne({ $pull: { image: image._id } });
        await image.deleteOne();
        res.status(200).json({ message: `Image has been deleted` });
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

export const updateImage = async (req, res) => {
  try {
    const user = await User.findOne(req.user);
    const image = await Image.findOne({ slug: req.params.slug });
    if (user === image.author || user.isAdmin) {
      try {
        const img = await image.updateOne({
          $set: req.body,
          image: req.file.originalname,
          author: image.author,
        });
        res.status(200).json({ message: `Image has been updated`, img });
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

export const getImages = async (req, res) => {
  try {
    const images = await Image.find();
    if (!images) {
      return res.status(404).json({ error: `Images not found` });
    }
    res.status(200).json(images);
  } catch (error) {
    return res.status(500).json({ error: `Internal Server Error` });
  }
};

export const getImage = async (req, res) => {
  try {
    const image = await Image.findOne({ slug: req.params.slug });
    if (!image) {
      return res.status(404).json({ error: `Image not found` });
    }
    res.status(200).json(image);
  } catch (error) {
    return res.status(500).json({ error: `Internal Server Error` });
  }
};
