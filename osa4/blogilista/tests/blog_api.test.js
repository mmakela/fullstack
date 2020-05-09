const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})
  const user = await helper.addRootUser()
  await Blog.insertMany(helper.initialBlogs.reduce((acc, it) => {
    it.user = user._id
    acc.push(it)
    return acc
  }, []))
})

afterAll(() => {
  mongoose.connection.close()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('there is id in a blog', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body[0].id).toBeDefined()
})

test('add a new blog', async () => {
  const newBlog = {
    title: 'Build for the Developers',
    author: 'Jarkko Moilanen',
    url: 'https://buildfordevelopers.com',
    likes: 1,
  }

  const token = await helper.getTokenForRoot()

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const titles = response.body.map(blog => blog.title)

  expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
  expect(titles).toContain('Build for the Developers')
})

test('that likes gets value zero if not given', async () => {
  const newBlog = {
    title: 'Build for the Developers',
    author: 'Jarkko Moilanen',
    url: 'https://buildfordevelopers.com',
  }

  const token = await helper.getTokenForRoot()

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)

  expect(response.body.likes).toBe(0)
})

test('title not given', async () => {
  const newBlog = {
    author: 'Jarkko Moilanen',
    url: 'https://buildfordevelopers.com',
  }

  const token = await helper.getTokenForRoot()

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect('Content-Type', /application\/json/)
    .expect(400, '{"error":"Blog validation failed: title: Path `title` is required."}')
})

test('url not given', async () => {
  const newBlog = {
    title: 'Build for the Developers',
    author: 'Jarkko Moilanen',
  }

  const token = await helper.getTokenForRoot()

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect('Content-Type', /application\/json/)
    .expect(400, '{"error":"Blog validation failed: url: Path `url` is required."}')
})

test('delete blog and check status code', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  const token = await helper.getTokenForRoot()

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)
})

test('update blog', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]
  const updatedBlog = {
    title: blogToUpdate.title,
    author: blogToUpdate.author,
    url: blogToUpdate.url,
    likes: blogToUpdate.likes + 5,
  }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlog)
    .expect(200, { ...updatedBlog, id: blogToUpdate.id, user: blogToUpdate.user.toString() })

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd[0].likes).toBe(blogToUpdate.likes + 5)
})

test('add a new blog without authentication token', async () => {
  const newBlog = {
    title: 'Build for the Developers',
    author: 'Jarkko Moilanen',
    url: 'https://buildfordevelopers.com',
    likes: 1,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401, '{"error":"token missing"}')
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const titles = response.body.map(blog => blog.title)

  expect(response.body).toHaveLength(helper.initialBlogs.length)
  expect(titles).not.toContain('Build for the Developers')
})
