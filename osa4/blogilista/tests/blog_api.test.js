const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialNotes)
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

  expect(response.body).toHaveLength(helper.initialNotes.length)
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

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const titles = response.body.map(blog => blog.title)

  expect(response.body).toHaveLength(helper.initialNotes.length + 1)
  expect(titles).toContain('Build for the Developers')
})

test('that likes gets value zero if not given', async () => {
  const newBlog = {
    title: 'Build for the Developers',
    author: 'Jarkko Moilanen',
    url: 'https://buildfordevelopers.com',
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)

  expect(response.body.likes).toBe(0)
})

test('title not given', async () => {
  const newBlog = {
    author: 'Jarkko Moilanen',
    url: 'https://buildfordevelopers.com',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect('Content-Type', /application\/json/)
    .expect(400, '{"error":"Blog validation failed: title: Path `title` is required."}')
})

test('url not given', async () => {
  const newBlog = {
    title: 'Build for the Developers',
    author: 'Jarkko Moilanen',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect('Content-Type', /application\/json/)
    .expect(400, '{"error":"Blog validation failed: url: Path `url` is required."}')
})

test('delete blog and check status code', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
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
    .expect(200, { ...updatedBlog, id: blogToUpdate.id })

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd[0].likes).toBe(blogToUpdate.likes + 5)
})

