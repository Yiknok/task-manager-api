const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const {sendWelcomeEmail, sendCancelationEmail} = require('../emails/account')

const userRouter = express.Router()

//user login
userRouter.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ token, user })
    } catch (err) {
        res.status(500).send({ error: 'Server Error!' })
    }
})

//User`s logout
userRouter.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save(
            res.send()
        )
    } catch (err) {
        res.status(500).send()
    }
})

//User`s Logout All
userRouter.post('/users/logoutAll', auth, async (req, res) => {
    try {
        // req.user.tokens = req.user.tokens.filter(()=> false)
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (err) {
        res.status(500).send()
    }
})


// Create User endpoint
userRouter.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        const token = await user.generateAuthToken()

        await user.save()
        // sendWelcomeEmail(user.email, user.name)
        res.status(201).send({ token, user })
    } catch (err) {
        res.status(400).send()
    }
})

// Read user`s profile
userRouter.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

//update user info
userRouter.put('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdate = ['name', 'email', 'password', 'age']
    const isAllowedToUpdate = updates.every((update) => allowedUpdate.includes(update))

    if (!isAllowedToUpdate) {
        return res.status(400).send({ error: 'Unable to update' })
    }

    try {
        //findByIdAndUpdate but destructuring for middleware save 
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()

        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        res.send(req.user)
    } catch (err) {
        res.status(400).send('Validation fail')
    }
})

userRouter.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.deleteOne()
        // sendCancelationEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch (err) {
        res.status(500).send({ error: 'Server Error!' })
    }
})

const avatar = multer({
    limits: {
        fileSize:1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload image'))
        }

        cb(undefined,true)
    }
})

userRouter.post('/users/me/avatar',auth, avatar.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

userRouter.delete('/users/me/avatar',auth, async(req,res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send(200)
})
userRouter.get('/users/:id/avatar', async(req,res)=>{
    try {
        const user = await User.findById(req.params.id)
        if(!user.avatar||!user){
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (err) {
        res.status(400).send()
    }
})

module.exports = userRouter

