const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: String,
  category: String,
  image: String,
  ingredients: [String],
  recipe: String,
  difficulty: String,
  prepTime: String,
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = MenuItem; 