var mongooseObject = require("../mongooseConfig");

var productsSchema = mongooseObject.Schema({
  id: { type: String, required: true, unique: true },
  clicks: {type: Number, default: 0},
  name: { type: String, required: true },
  price: { type: Number, required: true },
  fit: { type: String, default: "Fits just right - not too tight, not too loose." },
  fitDescription: { type: String, required: true },
  sizeVarientsAvailable: { type: Boolean, default: true },
  materialDescription: String,
  shippingDescription: String,
  limitedEdition: { type: Boolean, default: false },
  mrp: { type: Number, required: true },
  updatedAt: Date,
  launchedAt: Date,
  categoryInfo: {
    gender: { type: String, required: true },
    superCategory: { type: String, required: true },
    subCategory: { type: String, required: true },
    sleeve: { type: String, required: true },
    fabric: { type: String , default: '100% Supima Cotton Mercerized. Pre-shrunk Reinforced.'},
    brand: { type: String, default: "-1" },
    model: { type: String, default: "-1" },
    // printed: { type: String, default: "true" },
    filters: []
  },
  sizes: { "400 G": Number, "1 KG": Number },
  shipsIn: {type: String, Default: "Ships in 24 Hours"},
  images: {
    display: String,
    additional: []
  }
});


var requestedProductsSchema = mongooseObject.Schema({
  contact: String,
  productId: String,
  size: String,
  requestedOn: Date
});
module.exports = {
    productCollection : mongooseObject.model('products', productsSchema),
    requestedProductsCollection: mongooseObject.model('requestedProducts', requestedProductsSchema)
}
