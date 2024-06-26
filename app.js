const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const { Strategy: GitHubStrategy } = require('passport-github');
const path = require('path');
const logger = require('./logger');
const errorHandler = require('./errorHandler');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const userRoutes = require('./routes/userRoutes').default;
const sessionRoutes = require('./routes/sessionRoutes');
const cartRoutes = require('./routes/cartRoutes');
const messageRoutes = require('./routes/messageRoutes');
const productRoutes = require('./routes/productRoutes');
const ticketRoutes = require('./routes/ticketRoutes');

const orderRoutes = require('./routes/orderRoutes');
const config = require("express-session");
const adminRoutes = require("./routes/adminRoutes");

// Inicializar la aplicación de Express
const app = express();

// Configuración de Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Ecommerce API',
            version: '1.0.0',
            description: 'API documentation for Ecommerce project'
        },
        servers: [
            { url: 'http://localhost:3000', description: 'Local server' }
        ]
    },
    apis: ['./routes/*.js'] // Rutas donde se encuentran tus definiciones de Swagger
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Middleware
app.use(cookieParser());
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(session({ secret: config.sessionSecret, resave: false, saveUninitialized: true }));

// Set up Handlebars
app.engine('handlebars', require('express-handlebars')());
app.set('view engine', 'handlebars');

// Conexion a MongoDB
mongoose.connect('mongodb://localhost:27017/ecommerce', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// Passport Github autenticación
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
},
    function (accessToken, refreshToken, profile, cb) {
        // Aquí debes definir la lógica para encontrar o crear un usuario en tu base de datos
        User.findOrCreate({ githubId: profile.id }, function (err, user) {
            return cb(err, user);
        });
    }
));

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/products', productRoutes);
app.use('/api/tickets', ticketRoutes); // Nuevo
app.use('/admin', adminRoutes);


// Ruta para probar logs
app.get('/loggerTest', (req, res) => {
    logger.debug('Debug log message');
    logger.http('HTTP log message');
    logger.info('Info log message');
    logger.warning('Warning log message');
    logger.error('Error log message');
    logger.fatal('Fatal log message');
    res.send('Logger test');
});

// Manejo de archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para manejo de errores
app.use(errorHandler);

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
app.use(express.static('public'));

app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
});




module.exports = app; // la app para usarla en los tests