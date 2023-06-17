const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')
const Schema = mongoose.Schema


const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid!')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (!(value.length > 6)) {
                throw new Error('Password length must be greater than 6')
            }
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password is invalid!(Includes password word)')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number')
            }
        }
    },
    tokens:[{
        token:{
            type: String,
            required:true
        }
    }],
    avatar:{
        type:Buffer
    }
},{
    timestamps:true
})

userSchema.virtual('tasks', {
    ref:'Tasks',
    localField:'_id',
    foreignField:'owner'
})

// userSchema.methods.getPublicProfile = function () {
//     const user = this
//     const userObject = user.toObject()

//     delete userObject.password
//     delete userObject.tokens

//     return userObject
// }
// another method to show only oublic user`s data? replace it with toJSON method? to start
userSchema.methods.toJSON = function () {
    const user = this
    const publicUserData = user.toObject()

    delete publicUserData.password
    delete publicUserData.tokens
    delete publicUserData.avatar

    return publicUserData
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({token})
    await user.save()

    return token

}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await Users.findOne({ email: email })

    if (!user) {
        throw new Error('Unnable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('unnable to login')
    }

    return user
}

userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

userSchema.pre('deleteOne',{document:true, query:false}, async function(next){
    const user = this
    try {
        await Task.deleteMany({owner:user._id})

        next()
    } catch (err) {
        
    }
   
})

const Users = mongoose.model('User', userSchema)

module.exports = Users