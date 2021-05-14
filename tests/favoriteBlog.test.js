const listHelper = require('../utils/list_helper')

describe('favoriteBlog', () => {
    test('return null when passed empty list', () => {
        expect(listHelper.favoriteBlog([])).toBeNull()
    })

    test('return blog info if only one passed', () => {
        const blog = [{
            _id: 'welf87233g318332673',
            title: 'Awesome article',
            author: 'me',
            url: 'http://localhost:3000',
            likes: 9999,
            __v: 0
        }]

        expect(listHelper.favoriteBlog(blog)).toStrictEqual({
            title: 'Awesome article',
            author: 'me',
            likes: 9999,
        })
    })

    test('return most liked blog', () => {
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

        expect(listHelper.favoriteBlog(blogs)).toStrictEqual({
            title: 'Awesome article',
            author: 'me',
            likes: 10000,
        })
    })

    test('return first most liked blog', () => {
        const blogs = [
            {
                _id: 'fugwe67w3h3893yr',
                title: 'Okay article',
                author: 'maybe me',
                url: 'http://localhost:3000',
                likes: 500,
                __v: 0
            },
            {
                _id: 'welf87233g318332673',
                title: 'Awesome article',
                author: 'me',
                url: 'http://localhost:3000',
                likes: 10000,
                __v: 0
            },
            {
                _id: 'h3487ogyf2378o3f2g',
                title: 'Very nice article',
                author: 'also me',
                url: 'http://localhost:3000',
                likes: 10000,
                __v: 0
            },
        ]

        expect(listHelper.favoriteBlog(blogs)).toStrictEqual({
            title: 'Awesome article',
            author: 'me',
            likes: 10000,
        })
    })
})
