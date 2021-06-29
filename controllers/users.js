const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')

const User = require('../models/user')

usersRouter.post('/', async (req, res) => {
    const password = req.body.password
    const passLength = 3

    if (password.length < passLength) {
        return res.status(400).json({
            error: `Password length must be ${passLength} symbols or greater`
        })
    }

    const saltRounds = 10
    const passHash = await bcrypt.hash(password, saltRounds)

    const newUser = new User({
        username: req.body.username,
        name: req.body.name,
        passHash,
        blogs: [],
    })

    let savedUser

    try {
        savedUser = await newUser.save()
    } catch (e) {
        return res.status(400).json({
            error: e.message
        })
    }

    res.json(savedUser)
})

usersRouter.get('/', async (req, res) => {
    const users = await User.find({}).populate('blogs')

    res.json(users)
})

module.exports = usersRouter
