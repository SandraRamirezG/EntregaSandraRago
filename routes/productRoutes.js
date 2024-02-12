const express = require('express');
const router = express.Router();
const Product = require('../dao/models/product');

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

module.exports = router;