import { getCovidData, getCityData } from './utils/serverCalls'
import World from './World'
import { useState, useEffect, useRef } from 'react'
import useCustom from './CustomHooks'
import Details from './Details'
import Charts from './Charts'
import { ThemeProvider, createTheme, makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Filter from './Filter'
import CircularProgress from '@material-ui/core/CircularProgress'

const theme = createTheme({
  palette: {
    type: "dark"
  }
})
const useStyles = makeStyles({
  grid: {
    backgroundColor: 'black',
    opacity:     1,
  },
  globe: {
    height: 700, 
  },
})

function App() {
  const classes = useStyles()
  const [covid, setCovid] = useState([])
  const [cites, setCites] = useState([])
  const [dataOverTime, setDataOverTime] = useState([])
  const [globalState, setGlobalState] = useCustom()
  const [height, setHeight] = useState(0)
  const [width, setWidth] = useState(0)
  const globe = useRef(null)
  
  // eslint-disable-next-line
  useEffect(() => {
    if (globe && globe.current && globe.current.clientWidth) {
      setWidth(globe.current.clientWidth) 
      setHeight(globe.current.clientHeight) 
    }
  })

  useEffect(() => {
    setGlobalState({ 
      filterBy: 'new_cases',
      selected: null,
    })
    getCovidData((d, dot) => {
      setCovid(d)
      setDataOverTime(dot)
    })
    getCityData((d) => setCites(d))

  }, [setGlobalState])
  
  useEffect(() => {
    const selectCountry='France'
    const element = covid.filter(i => i.country === selectCountry)
    if (element) {
      setGlobalState({selected: element[0]})
    }
  }, [covid, setGlobalState])
    
  return (
    <ThemeProvider theme={theme}>
      <div>
        {!globalState.selected &&
          <Grid container justifyContent="center" alignItems="center">
              <CircularProgress />
          </Grid>
        }        
        {globalState.selected &&
          <Grid container spacing={3} className={classes.grid}>
            <Grid item xs={12} sm={4}>
              <Details />
            </Grid>
            <Grid item xs={12} sm={8}>
              <Grid container spacing={3} direction="column">
                <Grid item xs={6}>
                  <Filter />  
                </Grid>
                <Grid item xs={11}>
                  <Charts data={dataOverTime} filterBy={globalState.filterBy} />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <div className={classes.globe} ref={globe} id="globe">
                <World filterBy={globalState.filterBy} covid={covid} cites={cites} height={height} width={width}/>
              </div>
            </Grid>
          </Grid>        
        }
      </div>
    </ThemeProvider>  
  )
}

export default App
