import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, likeBlog, deleteBlog, user }) => {
  const [detailed, setDetailed] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleDetails = () => {
    setDetailed(!detailed)
  }
  const buttonLabel = detailed ? 'hide' : 'show'
  const showWhenDetails = { display: detailed ? '' : 'none' }
  const showWhenDetailsAndUser = { display: detailed && blog.user.username === user.username ? '' : 'none' }

  const handleLike = () => {
    likeBlog(blog.id, {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user.id,
    })
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title}
        <button onClick={toggleDetails}>{buttonLabel}</button>
      </div>
      <div style={showWhenDetails}>{blog.author}</div>
      <div style={showWhenDetails}>{blog.url}</div>
      <div style={showWhenDetails}>
        {blog.likes}
        <button onClick={handleLike}>like</button>
      </div>
      <div style={showWhenDetails}>{blog.user.name}</div>
      <div style={showWhenDetailsAndUser}>
        <button onClick={() => deleteBlog(blog.id)}>remove</button>
      </div>
    </div>
  )
}

const BlogForm = ({ addBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    addBlog({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          title
          <input
            id="title"
            type="text"
            value={title}
            name="title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            id="author"
            type="text"
            value={author}
            name="author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url
          <input
            id="url"
            type="text"
            value={url}
            name="url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  likeBlog: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
}

export { Blog, BlogForm }
