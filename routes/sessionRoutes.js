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

import { Router } from 'express';
import SessionController from '../controllers/sessionController';



/**
 * @swagger
 * /api/sessions/login:
 *   post:
 *     summary: Log in a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Incorrect password
 */
router.post('/login', SessionController.login);

/**
 * @swagger
 * /api/sessions/logout:
 *   post:
 *     summary: Log out a user
 *     responses:
 *       200:
 *         description: User logged out successfully
 */
router.post('/logout', SessionController.logout);

export default router;