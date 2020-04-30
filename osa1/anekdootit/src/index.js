import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const getRandomInt = (max, min) => Math.floor(Math.random() * (max - min + 1) + min)

const getArrayOfZeros = (len) => Array(len).fill(0)

const Button = (props) => {
  return (
      <button onClick={props.handleClick}>{props.text}</button>
  )
}

const Anecdote = ({ text, votes} ) => {
  return (
    <div>
      {text}
      <br />
      has {votes} votes
    </div>
  )
}

const Header = ({ title }) => {
  return (
    <h1>{title}</h1>
  )
}

const App = (props) => {
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(getArrayOfZeros(anecdotes.length))
  const nextAnecdote = () => {
    let newIndex
    do {
      newIndex = getRandomInt(anecdotes.length - 1, 0)  
    }
    while (newIndex === selected && anecdotes.length > 1)
    setSelected(newIndex)
  }
  const voteAnecdote = () => {
    const copy = [...votes]
    copy[selected] += 1
    setVotes(copy)
  }
  const getMostVotedAnecdoteIndex = () => {
    return votes.indexOf(Math.max(...votes))
  }

  return (
    <div>
      <Header title='Anecdote of the day' />
      <Anecdote text={props.anecdotes[selected]} votes={votes[selected]} />
      <Button handleClick={voteAnecdote} text='vote' />
      <Button handleClick={nextAnecdote} text='next anecdote' />
      <Header title='Anecdote with most votes' />
      <Anecdote text={props.anecdotes[getMostVotedAnecdoteIndex()]} votes={votes[getMostVotedAnecdoteIndex()]} />
    </div>
  )
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)
