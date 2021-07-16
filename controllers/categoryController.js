import Category from "../models/categoryModel.js";
import User from "../models/userModel.js";
import Image from "../models/imageModel.js";

export const createCategory = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(404).json({ error: `Please enter category name` });
    }
    const isCategory = await Category.findOne({title})
    if(isCategory) {
      return res.status(404).json({ error: `Category already exists` });
    }
    const user = await User.findById(req.user)
    const author = user.username
    // console.log(author)
    const newCategory = await Category.create({ title, author });
    const category = await newCategory.save();
    res.status(200).json({ message: `Category added successfully`, category });
  } catch (error) {
    return res.status(500).json({ error: `Internal Server Error` });
  }
};

export const getCategory = async (req, res) => {
  const cate = req.params.slug;
  try {
    const category = await Category.findOne({ slug: cate });
    if (!category) {
      return res.status(404).json({ error: `Category not found` });
    }
    // const images = await Image.findOne({ category: category });
    res.status(200).json(category);
  } catch (error) {
    return res.status(500).json({ error: `Internal Server Error` });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    if (!categories) {
      return res.status(404).json({ error: `Categories not found` });
    }
    res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ error: `Internal Server Error` });
  }
};

export const deleteCategory = async (req, res) => {
  const cate = req.params.slug;
  try {
    const category = await Category.findOne({ slug: cate });
    if (!category) {
      return res.status(404).json({ error: `Category not found` });
    }
    const user = await User.findOne(req.user);
    const userId = user._id;
    const categoryAuthor = category.author;
    if (categoryAuthor !== userId || user.isAdmin) {
      await category.deleteOne();
      res.status(200).json({ message: `Category has been deleted` });
    } else {
      return res.status(404).json({ error: `Invalid Access` });
    }
  } catch (error) {
    return res.status(500).json({ error: `Internal Server Error` });
  }
};
