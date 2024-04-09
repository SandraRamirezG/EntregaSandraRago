const express = require('express');
const router = express.Router();
const passport = require('../passport');
const User = require('../dao/models/user');

const { isAdmin, isUser } = require('../middlewares/authorizationMiddleware');


// POST /api/users/register
router.post('/register', async (req, res) => {
    try {
        const newUser = new User({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            age: req.body.age,
            password: req.body.password
        });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta protegida para administradores
router.get('/admin', isAdmin, (req, res) => {
    res.send('Esta es una ruta protegida para administradores');
});

// Ruta protegida para usuarios normales
router.get('/user', isUser, (req, res) => {
    res.send('Esta es una ruta protegida para usuarios normales');
});




module.exports = router;