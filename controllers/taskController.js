const Task = require('../models/taskModel')



// Task Creation
const taskCreation = async (req,res,next) => {
    try {
        const { title, description, status } = req.body 
        const allowedTypes = ['completed', 'inProgress', 'upComing']

        if(!title || !status) return res.status(400).json({
            success: false,
            message: "Required field is empty."
        })
        if(!allowedTypes.includes(status)) return res.status(400).json({
            success: false,
            message: "Invalid status!"
        })

        const userId = req.userId 
        const task = await Task.create({
            user: userId,
            title,
            description,
            status
        })

        res.status(201).json({
            success: true,
            message: "Task created successflly.",
            task: {
                user: userId,
                id: task._id,
                title: task.title,
                description: task.description,
                status: task.status
            }
        })

    } catch(err) {
        next(err)
    }
}


// View All Tasks
const allTask = async (req,res,next) => {
    try {
        const userId = req.userId
        const page = parseInt(req.query.page) || 1
        const limit = 5

        const tasks = await Task
        .find({ user: userId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * 10)
        .limit(limit)
        .lean()

        res.status(200).json({
            success: true,
            message: "Tasks fetched successfully.",
            tasks
        })

    } catch(err) {
        next(err)
    }
}

// Delete Tasks
const deleteTasks = async (req,res,next) => {
    try {
        const userId = req.userId
        const { ids } = req.body 

        if(!ids || !Array.isArray(ids)) res.status(400).json({
            success: false,
            message: "No task is selected."
        })

        const result = await Task.deleteMany({
            _id: { $in: ids },
            user: userId
        })

        res.status(200).json({
            success: true,
            message: "Selected task are deleted successfully.",
            deleteCount: result.deleteCount
        })

    } catch(err) {
        next(err)
    }
}


module.exports = {
    taskCreation,
    allTask,
    deleteTasks
}



