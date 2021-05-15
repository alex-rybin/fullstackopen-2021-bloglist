const countBy = require('lodash/countBy')
const maxBy = require('lodash/maxBy')

const dummy = blogs => {
    return 1 || blogs
}

const totalLikes = blogs => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = blogs => {
    let favorite = null

    const updateFavorite = blog => {
        if ((favorite?.likes ?? 0) < blog.likes) {
            favorite = {
                title: blog.title,
                author: blog.author,
                likes: blog.likes,
            }
        }
    }

    blogs.forEach(blog => updateFavorite(blog))

    return favorite
}

const mostBlogs = blogs => {
    const count = countBy(blogs, 'author')
    const topResult = maxBy(Object.entries(count), value => value[1])

    return topResult && {
        author: topResult[0],
        blogs: topResult[1],
    }
}

module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs
}
