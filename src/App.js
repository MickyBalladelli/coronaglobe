import Appbar from './Appbar'
import { getCovidData, getCityData } from './utils/serverCalls'
import World from './World'
import Console from './Console'
import { useState, useEffect } from 'react'
import useCustom from './CustomHooks'
import { FullScreen, useFullScreenHandle } from "react-full-screen"
import Details from './Details'

function App() {
  const [covid, setCovid] = useState([])
  const [cites, setCites] = useState([])
  const [globalState, setGlobalState] = useCustom()
  const handle = useFullScreenHandle()

  useEffect(() => {
    setGlobalState({ 
      filterBy: 'new_cases',
      handle: handle,
      selected: null,
    })
    getCovidData((d) => setCovid(d))
    getCityData((d) => setCites(d))

  }, [handle, setGlobalState])  

  return (
    <div>
      <Appbar />
      <FullScreen handle={handle}>
        <Console filterBy={globalState.filterBy} covid={covid} />
        <World filterBy={globalState.filterBy} covid={covid} cites={cites} />
        <Details />
      </FullScreen>
    </div>    
  )
}

export default App
