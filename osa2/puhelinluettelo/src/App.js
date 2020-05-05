import React, { useState, useEffect } from 'react'
import { getAll, create, delete_, update } from './services/persons'
import './App.css'

const Notification = ({ notification, error }) => {
  if (notification === null && error === null ) {
    return null
  }

  return (
    <div className={error ? 'error' : 'notification'}>
      {error || notification}
    </div>
  )
}

const Filter = (props) => {
  return (
    <div>
      filter shown with <input value={props.newFilter} onChange={event => props.setNewFilter(event.target.value)} />
    </div>
  )
}

const PersonForm = (props) => {
  return (
    <form onSubmit={props.addName}>
      <div>
        name: <input value={props.newName} onChange={event => props.setNewName(event.target.value)} />
      </div>
      <div>
        number: <input value={props.newNumber} onChange={event => props.setNewNumber(event.target.value)}/>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const NumberList = ({ persons, filterString, deleteName }) => {
  const showPersons = persons.filter(person => person.name.toLowerCase().includes(filterString))

  return (
    <div>
      {showPersons.map(person => 
        <p key={person.name}>
          {person.name} {person.number}
          <button onClick={() => deleteName(person)}>delete</button>
        </p>)}
    </div>
  )
}

const App = () => {
  const [ persons, setPersons] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newFilter, setNewFilter ] = useState('')
  const [ notification, setNotification ] = useState(null)
  const [ errorMessage, setErrorMessage ] = useState(null)

  useEffect(() => {
    getAll().then(response => {
      const persons = response.data
      setPersons(persons)
    })
  }, [])

  const addName = (event) => {
    event.preventDefault()

    const personObject = {
      name: newName, 
      number: newNumber
    }

    const match = persons.find(person => person.name === newName)

    if (match) {
      const response = window.confirm(
        `${match.name} is already added to phonebook, replace the old number with a new one?`
      )
      if (response) {
        update(match.id, personObject).then(() => {
          setPersons(persons.map(item => item.id === match.id ? {...item, ...personObject} : item))
          setNewName('')
          setNewNumber('')
          setNotification(`Updated ${match.name}`)
          setTimeout(() => {
            setNotification(null)
          }, 2000)
        })
        .catch(error => {
          setErrorMessage(`Person ${match.name} was alredy removed from server`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
      }
      return
    }

    create(personObject)
      .then(response => {
        setPersons(persons.concat(response.data))
        setNewName('')
        setNewNumber('')
        setNotification(`Added ${response.data.name}`)
        setTimeout(() => {
          setNotification(null)
        }, 2000)
      })
      .catch(error => {
        setErrorMessage(`${error.response.data.error}`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  const deleteName = person => {
    const response = window.confirm(`Delete ${person.name} ?`)
    if (response) {
      delete_(person.id).then(() => {
        setPersons(persons.filter(item => item.id !== person.id))
        setNotification(`Deleted ${person.name}`)
        setTimeout(() => {
          setNotification(null)
        }, 2000)
      })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      
      <Notification notification={notification} error={errorMessage} />
      <Filter newFilter={newFilter} setNewFilter={setNewFilter} />

      <h3>add a new</h3>
      <PersonForm addName={addName} newName={newName} newNumber={newNumber} setNewName={setNewName} setNewNumber={setNewNumber} />

      <h3>Numbers</h3>
      <NumberList persons={persons} filterString={newFilter} deleteName={deleteName} />
    </div>
  )

}

export default App
