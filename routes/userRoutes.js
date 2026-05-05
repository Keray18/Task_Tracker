const express = require("express")
const { registerUser, logUserIn } = require('../controllers/userController.js')

const Route = express.Router()

Route.post('/signUserUp', registerUser)
Route.post('/logUserIn', logUserIn)


module.exports = Route