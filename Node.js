const express = require('express');
const exphbs = require('express-handlebars');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs/promises');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = 8080;

app.use(express.json());
app.use(express.static('public'));

// Configuracion Handlebars 
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

const productsFile = 'productos.json';

// Ruta para productos
const productsRouter = express.Router();

// Obteniene todos los productos
productsRouter.get('/', async (req, res) => {
    try {
        const productsData = await fs.readFile(productsFile, 'utf-8');
        const products = JSON.parse(productsData);
        res.render('home', { products });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

// Agrega un nuevo producto
productsRouter.post('/', async (req, res) => {
    const newProduct = {
        id: uuidv4(),
        title: req.body.title,
        description: req.body.description,

    };

    try {
        const productsData = await fs.readFile(productsFile, 'utf-8');
        const products = JSON.parse(productsData);

        products.push(newProduct);

        await fs.writeFile(productsFile, JSON.stringify(products, null, 2));

        // nuevo producto a través de Socket.IO
        io.emit('newProduct', newProduct);

        res.redirect('/realtimeproducts');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

app.use('/api/products', productsRouter);

// Ruta de vistas
app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
});

// Socket.IO
io.on('connection', (socket) => {
    console.log('Cliente conectado');

    //  desconexiones
    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
