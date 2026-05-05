const User = require('../models/userModel')
const bcrypt = require("bcrypt")
const generateToken = require('../utilities/generateToken')



// Register
const registerUser = async (req,res,next) => {
    try {
        const { name, email, password } = req.body 
        if( !name || !email || !password) return res.status(400).json({
            success: false,
            message: "Missing field!"
        })

        const passwordHash = await bcrypt.hash(password, 10)

        
        const user = await User.create({
            name,
            email,
            password: passwordHash 
        })
        const token = generateToken(user._id)

        res.status(201).json({
            success: true,
            message: "User created successfully!",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })
    
    } catch(err) {
        next(err)
    }
}


// Login
const logUserIn = async (req,res,next) => {
    try {
        const { email, password } = req.body 
        const user = await User.findOne({ email })

        if(!user) return res.status(404).json({
            success: false,
            message: "Invalid Credentials!"
        })

        const isMatched = await bcrypt.compare(password, user.password)
        if(!isMatched) return res.status(404).json({
            success: false,
            message: "Password does not match."
        })

        const token = generateToken(user._id)

        res.status(200).json({
            success: true,
            message: "User logged in successfully!",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })

    } catch(err) {
        next(err)
    }
}



module.exports = {
    registerUser,
    logUserIn
}