const listHelper = require('../utils/list_helper')

describe('totalLikes', () => {
    test('return amount of likes of a single blog', () => {
        const blog = [{
            _id: 'welf87233g318332673',
            title: 'Awesome article',
            author: 'me',
            url: 'http://localhost:3000',
            likes: 9999,
            __v: 0
        }]

        expect(listHelper.totalLikes(blog)).toBe(9999)
    })

    test('return sum of likes of several blogs', () => {
        const blogs = [
            {
                _id: 'welf87233g318332673',
                title: 'Awesome article',
                author: 'me',
                url: 'http://localhost:3000',
                likes: 10000,
                __v: 0
            },
            {
                _id: 'fugwe67w3h3893yr',
                title: 'Okay article',
                author: 'maybe me',
                url: 'http://localhost:3000',
                likes: 500,
                __v: 0
            },
        ]

        expect(listHelper.totalLikes(blogs)).toBe(10500)
    })

    test('return zero when blogs are not present', () => {
        expect(listHelper.totalLikes([])).toBe(0)
    })
})
