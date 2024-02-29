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

// Conexion Mongo
mongoose.connect('mongodb://localhost:27017/ecommerce', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set up Handlebars
app.engine('handlebars', require('express-handlebars')());
app.set('view engine', 'handlebars');

// Routes
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const messageRoutes = require('./routes/messageRoutes');

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

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});