import Product from "../models/product.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ success: true, products });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch products" });
  }
};

const getProductById = async (req, res) => {
  try {
    console.log("Entered here");
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, product });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch product" });
  }
};

const addProduct = async (req, res) => {
  try {
    const { name, description, price, stock, unit } = req.body;
    let image;
    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloudRes = await cloudinary.uploader.upload(fileUri);
      image = cloudRes.secure_url;
    }

    if (!name || !description || !price || !image || !unit) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      unit,
      image,
    });
    res.status(201).json({ message: "saved", success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to add product" });
  }
};

const updateProduct = async (req, res) => {
  try {
    console.log("Entered Updated Product");
    console.log(req.body);
    const { name, description, price,  stock, unit } = req.body;
    console.log("product detail",name, description, price,  stock, unit);
    const updateData = { name, description, price,  stock, unit };
    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, product });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to update product" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, message: "Product deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to delete product" });
  }
};

export {
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
}