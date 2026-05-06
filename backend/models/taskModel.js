const mongoose = require("mongoose")


const taskSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true 
    },
    title: {
        type: String,
        minLength: 1,
        maxLength: 20,
        required: true 
    },
    description: {
        type: String,
        minLength: 10,
        maxLength: 300
    },
    status: {
        type: String,
        enum: ['completed', 'inProgress', 'upComing'],
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    }

}, {
    timestamps: true 
})

taskSchema.index({ user: 1, createdAt: -1 })

module.exports = mongoose.model('Task', taskSchema)