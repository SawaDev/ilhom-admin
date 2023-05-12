import express from "express"
import { createProduct, deleteProduct, getProduct, getProducts, getStats, updateProduct } from "../controllers/product.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, createProduct);
router.put("/:id", verifyToken, updateProduct);
router.delete("/:id", verifyToken, deleteProduct)
router.get("/find/:id", getProduct)
router.get("/", getProducts)
router.get("/stats", getStats);

export default router;