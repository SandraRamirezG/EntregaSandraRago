const express = require('express');
const fs = require('fs/promises');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 8080;

app.use(express.json());

const productsFile = 'productos.json';

// Rutas para productos
const productsRouter = express.Router();

// Obtener todos los productos
productsRouter.get('/', async (req, res) => {
    try {
        const productsData = await fs.readFile(productsFile, 'utf-8');
        const products = JSON.parse(productsData);
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

// Agregar un nuevo producto
productsRouter.post('/', async (req, res) => {
    const newProduct = {
        id: uuidv4(),
        title: req.body.title,
        description: req.body.description,
        code: req.body.code,
        price: req.body.price,
        status: req.body.status || true,
        stock: req.body.stock,
        category: req.body.category,
        thumbnails: req.body.thumbnails || [],
    };

    try {
        const productsData = await fs.readFile(productsFile, 'utf-8');
        const products = JSON.parse(productsData);

        products.push(newProduct);

        await fs.writeFile(productsFile, JSON.stringify(products, null, 2));
        res.json(newProduct);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

app.use('/api/products', productsRouter);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});