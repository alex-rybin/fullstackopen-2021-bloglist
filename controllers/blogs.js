const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
    Blog
        .find({})
        .then(blogs => {
            response.json(blogs)
        })
})

blogsRouter.post('/', async (request, response, next) => {
    const body = request.body
    const blog = new Blog({...body, likes: body.likes || 0})

    try {
        const savedBlog = await blog.save()
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

module.exports = blogsRouter
