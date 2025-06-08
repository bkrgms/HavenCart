const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Çorbalar', 'Ana Yemekler', 'Et Yemekleri', 'Tavuk Yemekleri', 'Balık & Deniz Ürünleri', 
           'Sebze Yemekleri', 'Pilavlar', 'Makarnalar', 'Salatalar', 'Tatlılar', 'İçecekler', 
           'Aperatifler', 'Kahvaltı', 'Hamur İşleri']
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Kolay', 'Orta', 'Zor']
  },
  cookTime: {
    type: String,
    required: true
  },
  prepTime: {
    type: String,
    default: '15 dk'
  },
  servings: {
    type: Number,
    required: true,
    min: 1,
    max: 20
  },
  ingredients: [{
    name: {
      type: String,
      required: true
    },
    amount: {
      type: String,
      required: true
    },
    unit: {
      type: String,
      required: true
    }
  }],
  instructions: [{
    type: String,
    required: true
  }],
  tips: [{
    type: String
  }],
  image: {
    type: String,
    default: function() {
      return `https://source.unsplash.com/800x600/?${encodeURIComponent(this.name)},turkish,food,recipe`;
    }
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
}, {
  timestamps: true
});

// Index for search
RecipeSchema.index({ name: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Recipe', RecipeSchema); 