const mongoose = require('mongoose');
const paginate = require('mongoose-paginate-v2')

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    code: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    status: { type: String, required: true },
    stock: { type: Number, required: true },
    category: String,
    thumbnails: [String],
    createdAt: { type: Date, default: Date.now }
});

productSchema.plugin(paginate)

const Product = mongoose.model('Product', productSchema);

module.exports = Product;