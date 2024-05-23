const express = require('express');
const router = express.Router();
const Product = require('../dao/models/product');

const { generateMockProducts } = require('../dao/mockingManager');

// Todos los productos
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Un solo producto
router.get('/:productId', async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (!product) return res.status(404).send('Product not found');
        res.json(product);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Crear nuevo producto
router.post('/', async (req, res) => {
    try {
        const { name, description, price, quantity } = req.body;
        const newProduct = new Product({ name, description, price, quantity });
        await newProduct.save();
        res.status(201).send('Product created successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Endpoint para generar productos simulados
router.get('/mockingproducts', (req, res) => {
    const mockProducts = generateMockProducts();
    res.json(mockProducts);
});


module.exports = router;

import { Router } from 'express';
import { isAdmin, isUser } from '../middlewares/authorizationMiddleware';
import ProductController from '../controllers/productController';

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     responses:
 *       200:
 *         description: Array of all products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get('/', ProductController.getAllProducts);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created successfully
 */
router.post('/', isAdmin, ProductController.createProduct);

export default router;