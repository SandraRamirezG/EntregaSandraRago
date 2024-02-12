const express = require('express');
const app = express();
const routerProducts = express.Router();
const routerCarts = express.Router();
const fs = require('fs');
const path = require('path');

app.use(express.json());

// Productos

let products = [];

routerProducts.get('/', (req, res) => {
    const { limit } = req.query;
    if (limit) {
        const limitedProducts = products.slice(0, parseInt(limit));
        return res.json(limitedProducts);
    }
    res.json(products);
});

routerProducts.get('/:pid', (req, res) => {
    const pid = parseInt(req.params.pid);
    const product = products.find(p => p.id === pid);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
});

routerProducts.post('/', (req, res) => {
    const {
        title,
        description,
        code,
        price,
        status = true,
        stock,
        category,
        thumbnails = []
    } = req.body;

    if (!title || !description || !code || !price || !status || !stock || !category) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const newProduct = {
        id: products.length + 1,
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails
    };

    products.push(newProduct);
    saveProducts();

    res.status(201).json(newProduct);
});

routerProducts.put('/:pid', (req, res) => {
    const pid = parseInt(req.params.pid);
    const {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails
    } = req.body;

    const productIndex = products.findIndex(p => p.id === pid);
    if (productIndex === -1) return res.status(404).json({ message: 'Product not found' });

    products[productIndex] = {
        ...products[productIndex],
        title: title || products[productIndex].title,
        description: description || products[productIndex].description,
        code: code || products[productIndex].code,
        price: price || products[productIndex].price,
        status: status !== undefined ? status : products[productIndex].status,
        stock: stock !== undefined ? stock : products[productIndex].stock,
        category: category || products[productIndex].category,
        thumbnails: thumbnails || products[productIndex].thumbnails
    };

    saveProducts();

    res.json(products[productIndex]);
});

routerProducts.delete('/:pid', (req, res) => {
    const pid = parseInt(req.params.pid);
    const productIndex = products.findIndex(p => p.id === pid);
    if (productIndex === -1) return res.status(404).json({ message: 'Product not found' });

    products.splice(productIndex, 1);
    saveProducts();

    res.status(204).end();
});

function saveProducts() {
    fs.writeFileSync(path.join(__dirname, 'productos.json'), JSON.stringify(products));
}

// Carritos

let carts = [];

routerCarts.post('/', (req, res) => {
    const newCart = { id: carts.length + 1, products: [] };
    carts.push(newCart);
    saveCarts();
    res.status(201).json(newCart);
});

routerCarts.get('/:cid', (req, res) => {
    const cid = parseInt(req.params.cid);
    const cart = carts.find(c => c.id === cid);
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    res.json(cart);
});

routerCarts.post('/:cid/product/:pid', (req, res) => {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);

    const cartIndex = carts.findIndex(c => c.id === cid);
    if (cartIndex === -1) return res.status(404).json({ message: 'Cart not found' });

    const productIndex = carts[cartIndex].products.findIndex(p => p.product === pid);
    if (productIndex !== -1) {
        carts[cartIndex].products[productIndex].quantity += 1;
    } else {
        carts[cartIndex].products.push({ product: pid, quantity: 1 });
    }

    saveCarts();

    res.json(carts[cartIndex]);
});

function saveCarts() {
    fs.writeFileSync(path.join(__dirname, 'carrito.json'), JSON.stringify(carts));
}

app.use('/api/products', routerProducts);
app.use('/api/carts', routerCarts);

app.listen(8080, () => {
    console.log('Server listening on port 8080');
});
