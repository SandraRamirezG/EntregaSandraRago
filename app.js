const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fileSystemManager = require('./dao/fileSystemManager');
const mongodbManager = require('./dao/mongodbManager');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const messageRoutes = require('./routes/messageRoutes');
const path = require('path');
const bcrypt = require('bcrypt');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const session = require('express-session');
const passport = require('./passport');
const cookieParser = require('cookie-parser');
const config = require('./config');

// Conexion Mongo
mongoose.connect('mongodb://localhost:27017/ecommerce', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// Configuración de Express y MongoDB
const app = express();

app.use(cookieParser());
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true

    }));  // Inicializa la sesión






// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set up Handlebars
app.engine('handlebars', require('express-handlebars')());
app.set('view engine', 'handlebars');

// Importar rutas y modelos necesarios
const userRoutes = require('./routes/userRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const cartRoutes = require('./routes/cartRoutes');
const messageRoutes = require('./routes/messageRoutes');
const productRoutes = require('./routes/productRoutes');

//Passport milware
app.use(passport.initialize());
app.use(passport.session());
mongoose.connect('mongodb://localhost:27017/ecommerce', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/products', productRoutes);

app.use('/products', productRoutes);
app.use('/carts', cartRoutes);
app.use('/messages', messageRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Passport middleware
app.use(passport.initialize());

// Passport Github autenticación
passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
},
    function (accessToken, refreshToken, profile, cb) {
        User.findOrCreate({ githubId: profile.id }, function (err, user) {
            return cb(err, user);
        });
    }
));

//Routes
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const messageRoutes = require('./routes/messageRoutes');

const userRoutes = require('./routes/userRoutes');
const sessionRoutes = require('./routes/sessionRoutes');

// Rutas de usuarios
app.use('/api/users', userRoutes);

// Rutas de sesiones
app.use('/api/sessions', sessionRoutes);
