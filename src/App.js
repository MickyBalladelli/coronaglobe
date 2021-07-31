import logo from './logo.svg'
import './App.css'

import { getCovidData, getCityData } from './utils/serverCalls'
import France from './react-departements/France'
import World from './Globe/World'
import Console from './Console'
import { useState, useEffect } from 'react'

function App() {
  const [covid, setCovid] = useState([])
  const [cites, setCites] = useState([])

  
  useEffect(() => {

  }, [])
  useEffect(() => {
    getCovidData((d) => setCovid(d))
    getCityData((d) => setCites(d))
  }, [])  

  return (
    <div className="App">
      <Console />
      <World filterBy="new_cases" covid={covid} cites={cites} lines={false} polygons={true} />
    {/*
      <header className="App-header">
        <img src={logo} className="animated-logo" alt="logo" />
        <France departements={[75, 89, 21, 33, 47, 74, "2a", 976]} />

        
      </header>
    */}
    </div>
    
  )
}

export default App
