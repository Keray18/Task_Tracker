const express = require("express")
const { taskCreation, allTask, deleteTasks } = require("../controllers/taskController")
const protect = require('../middleware/authMiddleware')

const Route = express.Router()

Route.post('/createTask', protect, taskCreation)
Route.get('/allTask', protect, allTask)
Route.delete('/delete', protect, deleteTasks)


module.exports = Route