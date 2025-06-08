const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    phone: {
        type: String,
        trim: true
    },
    address: {
        street: String,
        city: String,
        zipCode: String,
        country: String
    },
    role: {
        type: String,
        enum: ['user'],
        default: 'user'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    bookFavorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    }],
    recipeFavorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe'
    }],
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }],
    cart: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            default: 1,
            min: 1
        },
        type: {
            type: String,
            enum: ['product', 'book', 'recipe'],
            default: 'product'
        },
        addedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

// Password hash middleware
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema); 