import express from 'express';
import { createSale, dailySales, deleteSale, getSales, newCollection } from '../controllers/sale.js';
import { verifyToken } from '../utils/verifyToken.js';

const router = express.Router();

router.post("/", verifyToken, createSale)
router.post("/newCollection",  newCollection)
router.get("/", getSales)
router.delete("/:id", verifyToken, deleteSale)

//shunda xato bor
router.get("/:id/daily", dailySales)

export default router;