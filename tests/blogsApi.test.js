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

afterAll(() => {
    mongoose.connection.close()
})