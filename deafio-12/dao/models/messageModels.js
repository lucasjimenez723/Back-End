const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    text: { type: String, required: true }, 
    createdAt: { type: Date, default: Date.now } 
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;