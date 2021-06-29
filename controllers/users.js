const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')

const User = require('../models/user')

usersRouter.post('/', async (req, res) => {
    const saltRounds = 10
    const passHash = await bcrypt.hash(req.body.password, saltRounds)

    const newUser = new User({
        username: req.body.username,
        name: req.body.name,
        passHash,
    })

    const savedUser = await newUser.save()

    res.json(savedUser)
})

usersRouter.get('/', async (req, res) => {
    const users = await User.find({})

    res.json(users)
})

module.exports = usersRouter
