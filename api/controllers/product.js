import Sale from "../models/Sale.js";
import Product from "../models/Product.js";

export const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
}

export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    let newSoni = product.soni - req.body.soni;
    const updateProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
        $inc: { currentSoni: -newSoni }
      },
      { new: true }
    );
    res.status(200).json(updateProduct);
  } catch (err) {
    next(err);
  }
}

export const deleteProduct = async (req, res, next) => {
  try {
    await Product.findByIdAndDelete(req.params.id)

    await Sale.updateMany(
      { products: { $elemMatch: { productId: req.params.id } } },
      { $pull: { products: { productId: req.params.id } }, $set: { updatedAt: Date.now() } },
      { multi: true }
    );

    await Sale.deleteMany({ products: { $size: 0 } });

    res.status(200).json("O'chirildi");
  } catch (err) {
    next(err);
  }
}

export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
}

export const getProducts = async (req, res, next) => {
  try {
    const { type } = req.query;
    const products = await Product.aggregate([
      {
        $match: {
          $expr: {
            $cond: {
              if: { $eq: [type, undefined] },
              then: true,
              else: { $eq: ["$type", type] }
            }
          },
        }
      }
    ])

    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
}