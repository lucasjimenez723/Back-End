const mongoose = require("mongoose")


const usersColl = "users"
const userSchema = new mongoose.Schema({
    username: { type: String },
    first_name: { type: String },
    last_name: { type: String },
    age: { type: Number },
    email: { type: String, unique: true},
    password: { type: String,},
    role: { type: String, default: "user" },
    lastConnection: { type: Date, default: Date.now },
    cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'carts' }
}, { timestamps: true, strict: false});

const userModel = mongoose.model(usersColl, userSchema)

module.exports = {userModel}