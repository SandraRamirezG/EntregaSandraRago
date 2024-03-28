const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config');

// POST /api/sessions/login
router.post('/login', passport.authenticate('local', { failureRedirect: '/login-failure' }), (req, res) => {
    const token = jwt.sign({ id: req.user._id }, config.secretKey);
    res.json({ token });
});

// GET /api/sessions/logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/logout-success');
});

module.exports = router;