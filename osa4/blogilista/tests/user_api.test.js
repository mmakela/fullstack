const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

afterAll(() => {
  mongoose.connection.close()
})

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await helper.addRootUser()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('list all users', async () => {
    const result = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(result.body).toHaveLength(1)
    // console.log(result.body)
  })
})

describe('user creation validation', () => {
  test('username must be at least 3 chars long', async () => {
    const newUser = {
      username: 'mm',
      name: 'Miska Mäkelä',
      password: 'passu',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400, '{"error":"User validation failed: username: Path `username` (`mm`) is shorter than the minimum allowed length (3)."}')
  })

  test('password must be at least 3 chars long', async () => {
    const newUser = {
      username: 'miska',
      name: 'Miska Mäkelä',
      password: 'pa',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400, '{"error":"password must be at least 3 characters long"}')
  })
})
