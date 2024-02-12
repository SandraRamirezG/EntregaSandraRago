const express = require('express');
const app = express();
const port = 3000; // Puedes cambiar el puerto si lo deseas

const ProductManager = require('./ProductManager'); // Ajusta la ruta según tu estructura

// Crear una instancia de ProductManager
const productManager = new ProductManager('productos.json');

// Middleware para parsear el cuerpo de las peticiones como JSON
app.use(express.json());

// Endpoint para obtener todos los productos con límite opcional
app.get('/products', async (req, res) => {
    try {
        const limit = req.query.limit;
        const products = await productManager.getProducts();

        if (limit) {
            res.json(products.slice(0, parseInt(limit)));
        } else {
            res.json(products);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Endpoint para obtener un producto por ID
app.get('/products/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const product = await productManager.getProductById(productId);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});