const mongoose = require("mongoose")
const paginate = require("mongoose-paginate-v2")

const productosColl = "productos"
const productosSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String, 
    price: { type: Number, required: true, min: 0 },
    thumbnail: String,
    code: { type: String, required: true, unique: true },
    stock: { type: Number, required: true, min: 0 },
    status: Boolean,
    category: String,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'users', default: null }}, { timestamps: true });

productosSchema.plugin(paginate)

const modeloProductos = mongoose.model(productosColl, productosSchema)

module.exports = {modeloProductos}