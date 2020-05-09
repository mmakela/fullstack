import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [user, setUser] = useState(null)
  const [noticeMessage, setNoticeMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const jsonUser = window.localStorage.getItem('loggedBlogappUser')
    if (jsonUser) {
      const user = JSON.parse(jsonUser)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)

    try {
      const user = await loginService.login({ username, password })
      setUser(user)
      setUsername('')
      setPassword('')
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
    console.log(user.name, 'logged off')
    setNoticeMessage(`${user.name} logged out.`)
      setTimeout(() => {
        setNoticeMessage(null)
      }, 5000)
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    blogService.setToken('')
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    console.log('create a new blog')

    try {
      const blog = await blogService.create({ title, author, url })
      setBlogs(blogs.concat(blog))
      setTitle('')
      setAuthor('')
      setUrl('')
      setNoticeMessage(`a new blog ${title} by ${author} added`)
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

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>

        <Notification error={errorMessage} notice={noticeMessage} />

        <form onSubmit={handleLogin}>
          <div>
            username
              <input 
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
              />
          </div>
          <div>
            password
              <input 
              type="text"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
              />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>

      <Notification error={errorMessage} notice={noticeMessage} />
      
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
      <h2>create new</h2>
      <form onSubmit={handleCreate}>
        <div>
          title
            <input 
            type="text"
            value={title}
            name="title"
            onChange={({ target }) => setTitle(target.value)}
            />
        </div>
        <div>
          author
            <input 
            type="text"
            value={author}
            name="author"
            onChange={({ target }) => setAuthor(target.value)}
            />
        </div>
        <div>
          url
            <input 
            type="text"
            value={url}
            name="url"
            onChange={({ target }) => setUrl(target.value)}
            />
        </div>
        <button type="submit">create</button>
      </form>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App