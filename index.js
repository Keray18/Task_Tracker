const express = require("express")
const user = require('./routes/userRoutes')
const connectDB = require('./middleware/db.config')
const dotenv = require("dotenv")
dotenv.config()


const PORT = process.env.PORT || 3000

const app = express()
connectDB()

// middleware
app.use(express.json())



// Routes
app.use('/api/auth', user)


app.listen(PORT, () => {
    console.log(`Server started on ${PORT} successfullu.`)
})