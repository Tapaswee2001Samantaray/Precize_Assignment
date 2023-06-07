const { Schema, model } = require('mongoose');

const satResultSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    passed: {
        type: String,
        enum: ['Pass', 'Fail'],
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
},
    { timestamps: true }
);

module.exports = model('SatResult', satResultSchema);


