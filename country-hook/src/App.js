import React, { useState, useEffect } from 'react'
import axios from 'axios'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const useCountry = (name) => {
  const [country, setCountry] = useState(null)
  const [found, setFound] = useState(false)

  useEffect(() => {
    const getURL = `https://restcountries.eu/rest/v2/name/${name}?fullText=true`
    if (name) {
      axios.get(getURL)
        .then((response) => {
          if (response.status === 200) {
            setCountry(...response.data)
            setFound(true)
          } else {
            setCountry(null)
            setFound(false)
          }
        })
        .catch((response) => {
          console.log('error')
          setCountry(null)
          setFound(false)
        })
    }
  }, [name])

  return {country, found}
}

const Country = ({ country }) => {
  
  if (!country) {
    return null
  }
  
  if (!country.found) {
    return (
      <div>
        not found...
      </div>
    )
  }
  
  return (
    <div>
      <h3>{country.country.name} </h3>
      <div>capital {country.country.capital} </div>
      <div>population {country.country.population}</div> 
      <img src={country.country.flag} height='100' alt={`flag of ${country.country.name}`}/>  
    </div>
  )
}

const App = () => {
  const nameInput = useField('text')
  const [name, setName] = useState('')
  const country = useCountry(name)

  const fetch = (e) => {
    e.preventDefault()
    setName(nameInput.value)
  }

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      <Country country={country} />
    </div>
  )
}

export default App