import logo from './logo.svg'
import './App.css'
import Appbar from './Appbar'
import { getCovidData, getCityData } from './utils/serverCalls'
import France from './react-departements/France'
import World from './Globe/World'
import Console from './Console'
import { useState, useEffect } from 'react'
import useCustom from './CustomHooks'

function App() {
  const [covid, setCovid] = useState([])
  const [cites, setCites] = useState([])
  const [globalState, setGlobalState] = useCustom()
  
  useEffect(() => {
    setGlobalState({ 
      format: 'Polygons',
      filterBy: 'new_cases',
    })
    getCovidData((d) => setCovid(d))
    getCityData((d) => setCites(d))

  }, [])  

  return (
    <div className="App">
      <Appbar />
      <Console filterBy={globalState.filterBy} covid={covid} />
      <World filterBy={globalState.filterBy} covid={covid} cites={cites} format={globalState.format} />
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
