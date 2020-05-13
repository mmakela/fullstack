import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import { Blog, BlogForm } from './Blog'

describe('Blog list', () => {
  const blog = {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    user: {
      name: 'juho kusti'
    }
  }
  const likeBlog = jest.fn()
  const deleteBlog = () => {}
  const user = {}

  let component

  beforeEach(() => {
    component = render(
      <Blog blog={blog} likeBlog={likeBlog} deleteBlog={deleteBlog} user={user} />
    )
  })

  test('in the beginning all except title is invisible', () => {
    const { getByText } = component

    expect(getByText('React patterns'))
      .not
      .toHaveStyle('display: none')
    expect(getByText('Michael Chan'))
      .toHaveStyle('display: none')
    expect(getByText('https://reactpatterns.com/'))
      .toHaveStyle('display: none')
    expect(getByText('7')
      .closest('div'))
      .toHaveStyle('display: none')
  })

  test('after clicking the button, children are displayed', () => {
    const button = component.getByText('show')
    fireEvent.click(button)

    const { getByText } = component

    expect(getByText('React patterns'))
      .not
      .toHaveStyle('display: none')
    expect(getByText('Michael Chan'))
      .not
      .toHaveStyle('display: none')
    expect(getByText('https://reactpatterns.com/'))
      .not
      .toHaveStyle('display: none')
    expect(getByText('7')
      .closest('div'))
      .not
      .toHaveStyle('display: none')
  })

  test('after clicking a like button twice, button handler function is called twice', () => {
    const button = component.getByText('like')
    fireEvent.click(button)
    fireEvent.click(button)

    expect(likeBlog.mock.calls).toHaveLength(2)
  })

})

describe('Blog form', () => {
  test('create blog entry and verify callback arguments', () => {
    const addBlog = jest.fn()
    const component = render(
      <BlogForm addBlog={addBlog} />
    )

    const title = component.container.querySelector('#title')
    const author = component.container.querySelector('#author')
    const url = component.container.querySelector('#url')
    const form = component.container.querySelector('form')

    fireEvent.change(title, {
      target: { value: 'Type wars' }
    })
    fireEvent.change(author, {
      target: { value: 'Robert C. Martin' }
    })
    fireEvent.change(url, {
      target: { value: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html' }
    })
    fireEvent.submit(form)

    expect(addBlog.mock.calls).toHaveLength(1)
    expect(addBlog.mock.calls[0][0]['title']).toBe('Type wars')
    expect(addBlog.mock.calls[0][0]['author']).toBe('Robert C. Martin')
    expect(addBlog.mock.calls[0][0]['url']).toBe('http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html')
  })
})
