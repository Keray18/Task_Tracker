const mongoose = require("mongoose")


const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true 
    },
    email: {
        type: String,
        required: true,
        unique: true 
    },
    password: {
        type: String,
        required: true 
    }
}, {
    timestamps: true
})

userSchema.index({ user: 1, createdAt: -1 })


module.exports = mongoose.model('User', userSchema)