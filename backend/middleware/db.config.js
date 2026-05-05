const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config()

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log("Database connected successfully."))
        .catch((err) => console.log("Database connection error: ", err))
    
    } catch(err) {
        console.error("Error connecting to database: ", err)
        process.exit(1)
    }
}

module.exports = connectDB