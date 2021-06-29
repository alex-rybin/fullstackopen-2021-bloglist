const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user')

    response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
    const body = request.body
    const user = await User.findOne({})
    const blog = new Blog({...body, likes: body.likes || 0, user: user._id})

    try {
        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()
        response.status(201).json(savedBlog)
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
