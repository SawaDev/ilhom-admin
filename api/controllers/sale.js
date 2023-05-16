import Sale from "../models/Sale.js"
import Product from "../models/Product.js"
import mongoose from "mongoose";

export const createSale = async (req, res, next) => {
  try {
    const productsToSell = [];

    const { products } = req.body;

    for (const product of products) {
      const existingProduct = await Product.findById(product.productId);
      if (existingProduct.currentSoni < product.ketdi) {
        return res.status(400).json({ error: `${existingProduct.name} is not enough` });
      }

      productsToSell.push({
        productId: existingProduct._id,
        ketdi: product.ketdi
      });
    }

    const newSale = new Sale({
      products: productsToSell,
    });

    for (const product of productsToSell) {
      await Product.updateOne(
        { _id: product.productId },
        { $inc: { currentSoni: -product.ketdi } }
      );
    }

    const savedSale = await newSale.save();

    res.status(201).json(savedSale);
  } catch (error) {
    next(error);
  }
}

export const newCollection = async (req, res, next) => {
  try {
    const { products } = req.body;

    for (const product of products) {
      await Product.updateOne(
        { _id: product.productId },
        { $inc: { currentSoni: product.ketdi, soni: product.ketdi } }
      );
    }

    const newSale = new Sale({ products, isSale: false });
    const savedSale = await newSale.save();

    res.status(200).send(savedSale);
  } catch (err) {
    next(err);
  }
}

export const getSales = async (req, res, next) => {
  try {
    const date = req?.query?.date

    const sales = await Sale.aggregate([
      {
        $addFields: {
          createdAtDate: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt'
            }
          }
        }
      },
      {
        $match: {
          $expr: {
            $cond: {
              if: { $eq: [date, "null"] },
              then: true,
              else: { $eq: ["$createdAtDate", date] }
            }
          },
          isSale: true
        }
      },
      {
        $unwind: "$products"
      },
      {
        $project: {
          _id: 1,
          ketdi: "$products.ketdi",
          products: 1,
          createdAtDate: 1
        }
      },
      {
        $lookup: {
          from: "products",
          localField: "products.productId",
          foreignField: "_id",
          as: "products"
        }
      },
      {
        $project: {
          _id: 1,
          ketdi: 1,
          products: 1,
          createdAtDate: 1,
        }
      },
      {
        $unwind: "$products"
      },
      {
        $addFields: {
          "products.ketdi": "$ketdi"
        }
      },
      {
        $group: {
          _id: {
            createdAtDate: '$createdAtDate',
            productId: '$products._id',
            productName: '$products.name',
            productSize: '$products.size',
            productType: '$products.type'
          },
          ketdiTotal: { $sum: '$products.ketdi' }
        }
      },
      {
        $group: {
          _id: '$_id.createdAtDate',
          sales: {
            $push: {
              _id: '$_id.productId',
              name: '$_id.productName',
              ketdi: '$ketdiTotal',
              type: '$_id.productType',
              size: '$_id.productSize'
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          createdAtDate: '$_id',
          sales: 1
        }
      },
      {
        $sort: { createdAtDate: -1 }
      }
    ]);

    res.json(sales);
  } catch (err) {
    next(err);
  }
}

export const dailySales = async (req, res, next) => {
  const id = req.params.id;
  const startDate = req.query.start;
  const endDate = req.query.end;

  try {
    const sales = await Sale.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
          isSale: true
        }
      },
      {
        $unwind: "$products"
      },
      {
        $match: {
          "products.productId": new mongoose.Types.ObjectId(id)
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          ketdi: { $sum: "$products.ketdi" }
        }
      },
      {
        $group: {
          _id: null,
          sales: {
            $push: {
              _id: "$_id",
              ketdi: "$ketdi"
            }
          },
          totalKetdi: { $sum: "$ketdi" }
        }
      },
      {
        $project: {
          _id: 0,
          sales: 1,
          totalKetdi: 1
        }
      },
    ]);

    sales.length === 0 && res.status(404).json("No sales");
    res.status(200).json(sales);
  } catch (err) {
    next(err);
  }
}

export const deleteSale = async (req, res, next) => {
  try {
    await Sale.findByIdAndDelete(req.params.id)

    res.status(200).json("O'chirildi");
  } catch (err) {
    next(err);
  }
}