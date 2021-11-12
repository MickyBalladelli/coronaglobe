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
import CssBaseline from '@material-ui/core/CssBaseline'

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
    height: '850px',
    width: '100%',
    maxHeight: 'fill-available'
  },
  charts: {
    backgroundColor: 'transparent',
    position: 'absolute',
    width: 700,
    top: 0,
    right: 10,
    margin: 10
  },
  details: {
    backgroundColor: 'transparent',
    position: 'absolute',
    width: 500,
    top: 0,
    left: 0,
  },
  circular: {
    backgroundColor: 'transparent',
    zIndex: 5000,
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  }

})

function App() {
  const classes = useStyles()
  const [covid, setCovid] = useState([])
  const [cites, setCites] = useState([])
  const [dataOverTime, setDataOverTime] = useState([])
  const [globalState, setGlobalState] = useCustom()
  const globe = useRef(null)
  
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
      <CssBaseline />
      <div>
        {!globalState.selected &&
          <div className={classes.circular}>
            <Grid container justifyContent="center" alignItems="center">
              <CircularProgress />
            </Grid>
          </div>
        }        
        <div className={classes.globe} ref={globe} id="globe" >
                <World filterBy={globalState.filterBy} covid={covid} cites={cites} height={window.innerHeight} width={window.innerWidth} />
        </div>
        <div className={classes.charts}>
          <Grid container spacing={3} direction="column">
            <Grid item xs={6}>
              <Filter />  
            </Grid>
            <Grid item xs={11}>
              <Charts data={dataOverTime} filterBy={globalState.filterBy} />
            </Grid>
          </Grid>
        </div>
        <div className={classes.details}>
          <Details />
        </div>
      </div>
    </ThemeProvider>  
  )
}

export default App
