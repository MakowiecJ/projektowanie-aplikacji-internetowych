const express = require('express');
const Message = require('../models/Message');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Wysłanie wiadomości
router.post('/', authenticateToken, async (req, res) => {
    const { receiver, content } = req.body;
    const newMessage = new Message({ sender: req.user.userId, receiver, content });
    await newMessage.save();
    res.status(201).json(newMessage);
});

// Pobranie wiadomości
router.get('/', authenticateToken, async (req, res) => {
    const { userId } = req.query;
    const messages = await Message.find({
        $or: [{ sender: req.user.userId }, { receiver: req.user.userId }]
    }).populate('sender receiver', 'username');
     // res.json(messages);
    res.render("messages/index")
});

module.exports = router;
