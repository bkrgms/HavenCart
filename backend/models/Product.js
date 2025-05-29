const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    images: [{
        type: String,
        required: true
    }],
    category: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    ratings: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        review: String,
        date: {
            type: Date,
            default: Date.now
        }
    }],
    averageRating: {
        type: Number,
        default: 0
    },
    totalReviews: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update average rating when a new review is added
productSchema.methods.updateAverageRating = function() {
    if (this.ratings.length === 0) {
        this.averageRating = 0;
        this.totalReviews = 0;
    } else {
        const total = this.ratings.reduce((acc, item) => acc + item.rating, 0);
        this.averageRating = total / this.ratings.length;
        this.totalReviews = this.ratings.length;
    }
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product; 