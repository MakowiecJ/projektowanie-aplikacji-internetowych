const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
        type: String,
        enum: ['Motoryzacja', 'Nieruchomości', 'Elektronika', 'Moda', 'Sport', 'Hobby', 'Usługi', 'Praca', 'Zwierzęta'],
        required: true
      },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    images: [{
      data: Buffer,
      extension: { type: String, required: true }
  }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Post', postSchema);
