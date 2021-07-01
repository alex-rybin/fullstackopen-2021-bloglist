const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

let token = null

const initialUser = {
    name: 'Alexander Rybin',
    username: 'alex_rybin',
    passHash: bcrypt.hashSync('password', 10),
    blogs: [],
}

const initialBlogs = [
    {
        title: 'Ich hasse Kinder',
        author: 'Till Lindemann',
        url: 'https://music.apple.com/ru/album/ich-hasse-kinder/1568745133?i=1568745135&l=en',
        likes: 1000,
        user: null
    },
    {
        title: 'Blessed Be',
        author: 'Spiritbox',
        url: 'https://music.apple.com/ru/album/blessed-be/1548317560?i=1548317561&l=en',
        likes: 999,
        user: null
    }
]

beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const userObject = new User(initialUser)
    const user = await userObject.save()

    initialBlogs.forEach(blog => blog.user = user._id)
    const blogObjects = initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    const blogs = await Promise.all(promiseArray)

    user.blogs = blogs.map(blog => blog._id)
    await user.save()

    token = `bearer ${jwt.sign({username: user.username, id: user._id}, process.env.SECRET)}`
})

test('blogs are returned as json', async () => {
    const response = await api.get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(initialBlogs.length)
})

test('blogs have id property', async () => {
    const response = await api.get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

    expect(response.body[0].id).toBeDefined()
})

test('blogs added when sent by post request', async () => {
    const newBlog = {
        title: 'We Are The People',
        author: 'Empire of the Sun',
        url: 'https://music.apple.com/ru/album/we-are-the-people/712862605?i=712862710&l=en',
        likes: 998,
    }

    await api.post('/api/blogs')
        .send(newBlog)
        .set('Authorization', token)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(initialBlogs.length + 1)
    expect(response.body[2].title).toBe('We Are The People')
    expect(response.body[2].author).toBe('Empire of the Sun')
    expect(response.body[2].url).toBe('https://music.apple.com/ru/album/we-are-the-people/712862605?i=712862710&l=en')
    expect(response.body[2].likes).toBe(998)
})

test('likes set to zero if not specified', async () => {
    const newBlog = {
        title: 'Shooting Stars',
        author: 'Bag Raiders',
        url: 'https://music.apple.com/ru/album/shooting-stars/1440810476?i=1440810921&l=en',
    }

    await api.post('/api/blogs')
        .send(newBlog)
        .set('Authorization', token)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    expect(response.body[2].likes).toBe(0)
})

test('returns error 400 when title or author is missing', async () => {
    const newBlog = {
        url: 'https://music.apple.com/ru/album/one/1440666225?i=1440666375&l=en',
        likes: 997,
    }

    await api.post('/api/blogs')
        .send(newBlog)
        .set('Authorization', token)
        .expect(400)
})

test('deletes object on delete request', async () => {
    const blog = await Blog.findOne({author: 'Till Lindemann'})

    await api.delete(`/api/blogs/${blog._id}`)
        .send()
        .set('Authorization', token)
        .expect(204)

    const blogAfterDeletion = await Blog.findOne({author: 'Till Lindemann'})

    expect(blogAfterDeletion).toBeNull()
})

test('updates object on patch request', async () => {
    const blog = await Blog.findOne({author: 'Spiritbox'})

    await api.patch(`/api/blogs/${blog._id}`)
        .send({likes: 3500})
        .set('Authorization', token)
        .expect(200)

    const blogAfterDeletion = await Blog.findOne({author: 'Spiritbox'})

    expect(blogAfterDeletion.likes).toBe(3500)
})

test('edit fails with error 401 when token is missing', async () => {
    const blog = await Blog.findOne({author: 'Spiritbox'})

    await api.patch(`/api/blogs/${blog._id}`)
        .send({likes: 3500})
        .expect(401)

    const blogAfterDeletion = await Blog.findOne({author: 'Spiritbox'})

    expect(blogAfterDeletion.likes).toBe(999)
})

test('delete fails with error 401 when token is missing', async () => {
    const blog = await Blog.findOne({author: 'Till Lindemann'})

    await api.delete(`/api/blogs/${blog._id}`)
        .send()
        .expect(401)

    const blogAfterDeletion = await Blog.findOne({author: 'Till Lindemann'})

    expect(blogAfterDeletion).not.toBeNull()
})

test('add fails with error 401 when token is missing', async () => {
    const newBlog = {
        title: 'We Are The People',
        author: 'Empire of the Sun',
        url: 'https://music.apple.com/ru/album/we-are-the-people/712862605?i=712862710&l=en',
        likes: 998,
    }

    await api.post('/api/blogs')
        .send(newBlog)
        .expect(401)

    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(initialBlogs.length)
})

afterAll(() => {
    mongoose.connection.close()
})
