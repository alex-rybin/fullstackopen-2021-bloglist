const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')

const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({}).populate('user')

    res.json(blogs)
})

blogsRouter.post('/', async (req, res, next) => {
    const body = req.body
    const token = req.token

    let decodedToken

    try {
        decodedToken = jwt.verify(token, process.env.SECRET)
    } catch (e) {
        next(e)
    }


    if (!decodedToken.id) {
        return res.status(401).json({
            error: 'Token is missing or invalid'
        })
    }
    const user = await User.findById(decodedToken.id)
    const blog = new Blog({...body, likes: body.likes || 0, user: user._id})

    try {
        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()
        res.status(201).json(savedBlog)
    } catch (exception) {
        next(exception)
    }
})

blogsRouter.delete('/:id', async (request, response, next) => {
    try {
        await Blog.deleteOne({_id: request.params.id})
        response.status(204).send()
    } catch (exception) {
        next(exception)
    }
})

blogsRouter.patch('/:id', async (request, response, next) => {
    try {
        await Blog.findByIdAndUpdate(request.params.id, request.body)
        response.status(200).send()
    } catch (exception) {
        next(exception)
    }
})

module.exports = blogsRouter
