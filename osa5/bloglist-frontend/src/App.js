import React, { useState, useEffect, useReducer } from 'react'
import { Blog, BlogForm } from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useReducer((state, action) => {
    action.sort((a, b) => b.likes - a.likes)
    return action
  }, [])

  const [user, setUser] = useState(null)
  const [noticeMessage, setNoticeMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const blogFormRef = React.createRef()

  useEffect(() => {
    const getBlogs = async () => {
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    }
    getBlogs()
  }, [])

  useEffect(() => {
    const jsonUser = window.localStorage.getItem('loggedBlogappUser')
    if (jsonUser) {
      const user = JSON.parse(jsonUser)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const login = async (credentials) => {
    try {
      const user = await loginService.login(credentials)
      setUser(user)
      blogService.setToken(user.token)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
    } catch (error) {
      console.log(error)
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async () => {
    setNoticeMessage(`${user.name} logged out.`)
      setTimeout(() => {
        setNoticeMessage(null)
      }, 5000)
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    blogService.setToken('')
  }

  const addBlog = async (blogObject) => {
    try {
      const blog = await blogService.create(blogObject)
      blogFormRef.current.toggleVisibility()
      setBlogs(blogs.concat(blog))
      setNoticeMessage(`a new blog ${blogObject.title} by ${blogObject.author} added`)
      setTimeout(() => {
        setNoticeMessage(null)
      }, 5000)
    } catch (error) {
      console.log(error)
      setErrorMessage(error.response.data.error)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const likeBlog = async (blogId, blogObject) => {
    await blogService.update(blogId, blogObject)
    const updatedBlogs = blogs.reduce((acc, current) => {
      if (current.id === blogId) {
        current.likes = blogObject.likes
      }
      acc.push(current)
      return acc
    }, [])
    setBlogs(updatedBlogs)
  }

  const deleteBlog = async (id) => {
    console.log('delete', id)
    await blogService.delete_(id)
    const updatedBlogs = blogs.reduce((acc, current) => {
      if (current.id !== id) {
        acc.push(current)
      }
      return acc
    }, [])
    setBlogs(updatedBlogs)
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>

        <Notification error={errorMessage} notice={noticeMessage} />
        <LoginForm login={login} />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>

      <Notification error={errorMessage} notice={noticeMessage} />
      
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>

      <Togglable buttonLabel="new note" ref={blogFormRef}>
        <BlogForm addBlog={addBlog} />
      }
      </Togglable>

      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          likeBlog={likeBlog}
          deleteBlog={deleteBlog}
          user={user}
          />
      )}
    </div>
  )
}

export default App