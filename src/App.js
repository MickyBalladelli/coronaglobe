import Appbar from './Appbar'
import { getCovidData, getCityData, getDataOverTime } from './utils/serverCalls'
import World from './World'
import Console from './Console'
import { useState, useEffect } from 'react'
import useCustom from './CustomHooks'
import { FullScreen, useFullScreenHandle } from "react-full-screen"
import Details from './Details'
import Charts from './Charts'

function App() {
  const [covid, setCovid] = useState([])
  const [cites, setCites] = useState([])
  const [dataOverTime, setDataOverTime] = useState([])
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
    getDataOverTime((d) => setDataOverTime(d))

  }, [handle, setGlobalState])  

  return (
    <div>
      <Appbar />
      <FullScreen handle={handle}>
        <Console filterBy={globalState.filterBy} covid={covid} />
        <World filterBy={globalState.filterBy} covid={covid} cites={cites} />
        <Details />
        <Charts data={dataOverTime}/>
      </FullScreen>
    </div>    
  )
}

export default App
