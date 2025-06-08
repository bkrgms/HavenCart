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
    category: {
        type: String,
        required: true
    },
    brand: {
        type: String
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    image: {
        type: String,
        required: true
    },
    images: [{
        url: {
            type: String,
            required: true
        },
        order: {
            type: Number,
            default: 0
        },
        isPrimary: {
            type: Boolean,
            default: false
        }
    }],
    features: [String],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
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