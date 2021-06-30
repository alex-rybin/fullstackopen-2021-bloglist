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

    const user = await User.findById(req.user)
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

blogsRouter.delete('/:id', async (req, res, next) => {
    try {
        const blog = await Blog.findById(req.params.id)

        if (blog.user.toString() !== req.user) {
            return res.status(401).json({
                error: 'Cannot delete blog of a different user'
            })
        }

        await blog.delete()
        res.status(204).send()
    } catch (exception) {
        next(exception)
    }
})

blogsRouter.patch('/:id', async (req, res, next) => {
    try {
        await Blog.findByIdAndUpdate(req.params.id, req.body)
        res.status(200).send()
    } catch (exception) {
        next(exception)
    }
})

module.exports = blogsRouter
