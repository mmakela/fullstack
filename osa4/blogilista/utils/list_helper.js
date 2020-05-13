const _ = require('lodash')
const logger = require('../utils/logger')

const dummy = (blogs) => {
  logger.info(blogs)
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, item) => sum + item.likes, 0)
}

const favoriteBlog = (blogs) => {
  const reducer = (max, item) => {
    if (max === null) {
      return item
    }
    return max.likes < item.likes ? item : max
  }

  const result = blogs.reduce(reducer, null)
  return {
    title: result.title,
    author: result.author,
    likes: result.likes,
  }
}

const mostBlogs = (blogs) => {
  const grouped = _.groupBy(blogs, 'author')
  const transformed = _.transform(grouped, (result, value, key) => {
    result.push({ author: key, blogs: value.length })
  }, [])
  return _.maxBy(transformed, 'blogs')
}

const mostLikes = (blogs) => {
  const grouped = _.groupBy(blogs, 'author')
  const reduced = _.reduce(grouped, (result, value, key) => {
    result[key] = value.reduce((accumulator, current) => accumulator + current.likes, 0)
    return result
  }, {})
  const transformed = _.transform(reduced, (result, value, key) => {
    result.push({ author: key, likes: value })
  }, [])
  return _.maxBy(transformed, 'likes')

}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
