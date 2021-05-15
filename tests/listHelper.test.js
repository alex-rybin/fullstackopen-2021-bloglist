const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)

    expect(result).toBe(1)
})

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

    test('return first most liked blog if there are several with the same likes', () => {
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

describe('mostBlogs', () => {
    test('return an author with most blogs', () => {
        const blogs = [
            {
                _id: 'fugwe67w3h3893yr',
                title: 'Okay article',
                author: 'me',
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

        expect(listHelper.mostBlogs(blogs)).toStrictEqual({
            author: 'me',
            blogs: 2
        })
    })

    test('return result if there is only one blog passed', () => {
        const blogs = [
            {
                _id: 'welf87233g318332673',
                title: 'Awesome article',
                author: 'me',
                url: 'http://localhost:3000',
                likes: 10000,
                __v: 0
            },
        ]

        expect(listHelper.mostBlogs(blogs)).toStrictEqual({
            author: 'me',
            blogs: 1
        })
    })

    test('return undefined if passed empty list', () => {
        expect(listHelper.mostBlogs([])).toBeUndefined()
    })

    test('return only first top author if there are several of them ', () => {
        const blogs = [
            {
                _id: 'fugwe67w3h3893yr',
                title: 'Okay article',
                author: 'me',
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
                title: 'pretty bad article',
                author: 'totally not me',
                url: 'http://localhost:3000',
                likes: 95,
                __v: 0
            },
            {
                _id: 'h3487ogyf2378o3f2g',
                title: 'this one is even worse',
                author: 'totally not me',
                url: 'http://localhost:3000',
                likes: 55,
                __v: 0
            },
        ]

        expect(listHelper.mostBlogs(blogs)).toStrictEqual({
            author: 'me',
            blogs: 2
        })
    })
})

describe('mostLikes', () => {
    test('return an author with most likes', () => {
        const blogs = [
            {
                _id: 'fugwe67w3h3893yr',
                title: 'Okay article',
                author: 'me',
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

        expect(listHelper.mostLikes(blogs)).toStrictEqual({
            author: 'me',
            likes: 10500
        })
    })

    test('return result if there is only one blog passed', () => {
        const blogs = [
            {
                _id: 'welf87233g318332673',
                title: 'Awesome article',
                author: 'me',
                url: 'http://localhost:3000',
                likes: 10000,
                __v: 0
            },
        ]

        expect(listHelper.mostLikes(blogs)).toStrictEqual({
            author: 'me',
            likes: 10000
        })
    })

    test('return undefined if passed empty list', () => {
        expect(listHelper.mostLikes([])).toBeUndefined()
    })

    test('return only first top author if there are several of them ', () => {
        const blogs = [
            {
                _id: 'fugwe67w3h3893yr',
                title: 'Okay article',
                author: 'me',
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
                title: 'pretty bad article',
                author: 'totally not me',
                url: 'http://localhost:3000',
                likes: 10000,
                __v: 0
            },
            {
                _id: 'h3487ogyf2378o3f2g',
                title: 'this one is even worse',
                author: 'totally not me',
                url: 'http://localhost:3000',
                likes: 500,
                __v: 0
            },
        ]

        expect(listHelper.mostLikes(blogs)).toStrictEqual({
            author: 'me',
            likes: 10500,
        })
    })
})
