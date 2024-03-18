const express = require('express');
const router = express.Router();
const passport = require('../passport');

// POST /api/sessions/login
router.post('/login', passport.authenticate('local', { failureRedirect: '/login-failure' }), (req, res) => {
    res.redirect('/login-success');
});

// GET /api/sessions/logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/logout-success');
});

module.exports = router;
