const express = require('express');
const router = express.Router();
const Message = require('../dao/models/message');

router.post('/', async (req, res) => {
    try {
        const { user, message } = req.body;
        const newMessage = new Message({ user, message });
        await newMessage.save();
        res.status(201).send('Message saved successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;