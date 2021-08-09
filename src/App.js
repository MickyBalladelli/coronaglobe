import Appbar from './Appbar'
import { getCovidData, getCityData } from './utils/serverCalls'
import World from './World'
import Console from './Console'
import { useState, useEffect } from 'react'
import useCustom from './CustomHooks'
import { FullScreen, useFullScreenHandle } from "react-full-screen"
import Details from './Details'
import Charts from './Charts'
import { ThemeProvider, createTheme } from '@material-ui/core/styles'

const theme = createTheme({
  palette: {
    type: "dark"
  }
})

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
    
    getCovidData((d, dot) => {
      setCovid(d)
      setDataOverTime(dot)
    })
    getCityData((d) => setCites(d))

  }, [handle, setGlobalState])  

  return (
    <ThemeProvider theme={theme}>
      <Appbar />
      <FullScreen handle={handle}>
        <Console filterBy={globalState.filterBy} covid={covid} />
        <World filterBy={globalState.filterBy} covid={covid} cites={cites} />
        {globalState.selected &&
        <div style={{pointerEvents: 'none'}}>
        <Details />
        <Charts data={dataOverTime} filterBy={globalState.filterBy} />
        </div>
        }
      </FullScreen>
    </ThemeProvider>  
  )
}

export default App
