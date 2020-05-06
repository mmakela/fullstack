const dummy = (blogs) => {
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

}

const mostLikes = (blogs) => {

}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
