const express = require("express")
const user = require('./routes/userRoutes')
const task = require('./routes/taskRoutes')
const connectDB = require('./middleware/db.config')
const dotenv = require("dotenv")
const errorHandler = require("./utilities/errorHandle")
dotenv.config()


const PORT = process.env.PORT || 3000

const app = express()
connectDB()

// middleware
app.use(express.json())



// Routes
app.use('/api/auth', user)
app.use('/api/task', task)

// Error Handler
app.use(errorHandler)


app.listen(PORT, () => {
    console.log(`Server started on ${PORT} successfullu.`)
})