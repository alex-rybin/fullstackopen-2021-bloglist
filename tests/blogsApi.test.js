const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
    {
        title: 'Ich hasse Kinder',
        author: 'Till Lindemann',
        url: 'https://music.apple.com/ru/album/ich-hasse-kinder/1568745133?i=1568745135&l=en',
        likes: 1000,
    },
    {
        title: 'Blessed Be',
        author: 'Spiritbox',
        url: 'https://music.apple.com/ru/album/blessed-be/1548317560?i=1548317561&l=en',
        likes: 999,
    }
]

beforeEach(async () => {
    await Blog.deleteMany({})

    for (let blog of initialBlogs) {
        let blogObject = new Blog(blog)
        await blogObject.save()
    }
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
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    expect(response.body[2].likes).toBe(0)
})

afterAll(() => {
    mongoose.connection.close()
})