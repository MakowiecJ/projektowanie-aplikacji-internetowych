const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Wysyłanie wiadomości
router.post('/send', async (req, res) => {
  try {
    const { content, sender, receiver } = req.body;
    const message = new Message({ content, sender, receiver });
    await message.save();
    res.status(201).send(message);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Odbieranie wiadomości
router.get('/receive/:userId', async (req, res) => {
  try {
    const messages = await Message.find({ receiver: req.params.userId }).populate('sender', 'username');
    res.status(200).send(messages);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/', async (req, res) => {
    try {
      // Możesz dostosować logikę, aby przekazać dodatkowe dane do widoku, np. listę użytkowników
      // const userId = req.params.userId;
      // const messages = await Message.find({
      //   $or: [{ sender: userId }, { receiver: userId }]
      // }).populate('sender receiver', 'username');
  
      res.render('chat/chat');
    } catch (error) {
      res.status(500).send(error);
    }
  });

module.exports = router;