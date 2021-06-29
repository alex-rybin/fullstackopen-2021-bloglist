const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

const initialUsers = [
    {
        name: 'Johnny Rzeznik',
        username: 'jrzeznik',
        passHash: '$4v$g6$F6g8/3qUg70tUjKF76v4TeTEUgmvC7AOIUh46F8NjjR8fewwit3iC',
    },
    {
        name: 'Sam Carter',
        username: 'scarter88',
        passHash: '$6v$j6$Fjg4/3qUg70tUjKF76v4TeTEY39Nh4FyQh46F8NjjR8Iov63G0Ph',
    },
]

beforeEach(async () => {
    await User.deleteMany({})

    const userObjects = initialUsers.map(user => new User(user))
    const promiseArray = userObjects.map(user => user.save())
    await Promise.all(promiseArray)
})

test('users are returned as json', async () => {
    const response = await api.get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(initialUsers.length)
})

test('user creation fails when password is too short', async () => {
    const newUser = {
        name: 'Chris Motionless',
        username: 'cmiw',
        password: '12',
    }

    const response = await api.post('/api/users')
        .send(newUser)
        .expect(400)

    expect(response.body).toStrictEqual({
        error: 'Password length must be 3 symbols or greater'
    })
})

test('user creation fails when username is too short', async () => {
    const newUser = {
        name: 'Chris Motionless',
        username: 'cm',
        password: 'nottooshort',
    }

    const response = await api.post('/api/users')
        .send(newUser)
        .expect(400)

    expect(response.body).toStrictEqual({
        error: 'User validation failed: username: Path `username` ' +
            '(`cm`) is shorter than the minimum allowed length (3).'
    })
})

afterAll(() => {
    mongoose.connection.close()
})
