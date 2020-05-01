import React from 'react'

const Course = (props) => {
  const { course } = props
  const total = course.parts.reduce((total, current) => total + current.exercises, 0)

  return (
    <div>
      <Header2 name={course.name} />
      <Content parts={course.parts} />
      <Total total={total} />
    </div>
  )
}

const Header1 = ({ name }) => ( <h1>{name}</h1> )
const Header2 = ({ name }) => ( <h2>{name}</h2> )

const Part = (props) => {
  const { part } = props

  return (
    <p>
      {part.name} {part.exercises}
    </p>
  )
}

const Content = (props) => {
  const { parts } = props

  return (
    <div>
      {parts.map(part => <Part key={part.id} part={part} />)}
    </div>
  )
}

const Total = (props) => {
  return (
    <p><b>Total of {props.total} exercises</b></p>
  )
}

export { Course, Header1 }
