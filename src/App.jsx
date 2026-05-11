import { getCovidData, getHantaData, getCityData } from './utils/serverCalls'
import World from './World'
import { useState, useEffect, useRef } from 'react'
import useCustom from './CustomHooks'
import Details from './Details'
import Charts from './Charts'
import { ThemeProvider, createTheme, styled } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import Filter from './Filter'
import CircularProgress from '@mui/material/CircularProgress'
import CssBaseline from '@mui/material/CssBaseline'
import ToggleButtonGroup from '@mui/lab/ToggleButtonGroup'
import ToggleButton from '@mui/lab/ToggleButton'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

const theme = createTheme({
  palette: {
    type: "dark"
     }
})

const HeaderBar = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 7000,
  backgroundColor: 'rgba(0, 0, 0, 0.85)',
  backdropFilter: 'blur(10px)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  padding: '12px 24px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})

const Title = styled(Typography)({
  color: '#fff',
  fontWeight: 600,
  fontSize: '1.25rem',
  letterSpacing: 0.5,
})

const DiseaseLabel = styled(Typography)({
  color: '#90caf9',
  fontWeight: 500,
  marginLeft: 16,
  fontSize: '1rem',
})

const GridContainer = styled(Grid)({
  backgroundColor: 'black',
  opacity: 1,
})

const GlobeContainer = styled('div')({
  position: 'fixed',
  top: 70,
  left: 0,
  right: 0,
  bottom: 0,
  width: '100%',
  zIndex: 1000
})

const ChartsContainer = styled('div')({
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  position: 'absolute',
  width: 700,
  top: 80,
  right: 20,
  zIndex: 8000,
  padding: 20,
  borderRadius: 8,
  border: '1px solid rgba(255, 255, 255, 0.1)'
})

const DetailsContainer = styled('div')({
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  position: 'absolute',
  width: 500,
  top: 80,
  left: 20,
  zIndex: 8000,
  padding: 20,
  borderRadius: 8,
  border: '1px solid rgba(255, 255, 255, 0.1)'
})

const CircularContainer = styled('div')({
  backgroundColor: 'transparent',
  zIndex: 5000,
  position: 'absolute',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
})
const ToggleLabel = styled(Typography)(data => { 
  if (data.selected) {
    return {
      color: '#fff',
      fontWeight: 600,
      fontSize: '1.25rem',
      letterSpacing: 0.5,
    }
  } 
  else {
    return {
      color: '#90caf9',
      fontWeight: 500,
      fontSize: '1rem',
    }
  }
})
function App() {
  const [diseaseData, setDiseaseData] = useState([])
  const [cities, setCities] = useState([])
  const [dataOverTime, setDataOverTime] = useState([])
  const [disease, setDisease] = useState('covid')
  const [globalState, setGlobalState] = useCustom()
  const globe = useRef(null)

  const loadDiseaseData = (diseaseType) => {
    if (diseaseType === 'covid') {
      setGlobalState({
        filterBy: 'new_cases',
        selected: null,
          })
      getCovidData((d, dot) => {
        setDiseaseData(d)
        setDataOverTime(dot)
          })
       } else {
      setGlobalState({
        filterBy: 'total_cases',
        selected: null,
          })
      getHantaData((d, dot) => {
        setDiseaseData(d)
        setDataOverTime(dot)
          })
        }
    getCityData((d) => setCities(d))
     }

  useEffect(() => {
    loadDiseaseData(disease)
     }, [disease, setGlobalState])

  useEffect(() => {
    const selectCountry = 'France'
    const element = diseaseData.filter(i => i.country === selectCountry)
    if (element) {
      setGlobalState({selected: element[0]})
         }
     }, [diseaseData, setGlobalState])

  const handleDiseaseChange = (event, newDisease) => {
    if (newDisease !== null) {
      setDisease(newDisease)
         }
       }

  return (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <HeaderBar>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Title variant="h5">Virus Globe</Title>
              <DiseaseLabel>
                {disease === 'covid' ? 'COVID-19 Data' : 'Hantavirus Data'}
              </DiseaseLabel>
            </Box>
            <ToggleButtonGroup
             value={disease}
             color="primary"
             exclusive
             onChange={handleDiseaseChange}
             aria-label="Disease selection"
             size="small"
            >
              <ToggleButton value="covid" aria-label="COVID-19">
               <ToggleLabel selected={disease === 'covid'}>COVID-19</ToggleLabel>
              </ToggleButton>
              <ToggleButton value="hanta" aria-label="Hantavirus">
               <ToggleLabel selected={disease === 'hanta'}>Hantavirus</ToggleLabel>
              </ToggleButton>
            </ToggleButtonGroup>
          </HeaderBar>
          <GridContainer container sx={{ paddingTop: 70 }}>
            {!globalState.selected &&
              <CircularContainer>
                <Grid container justifyContent="center" alignItems="center">
                  <CircularProgress />
                </Grid>
              </CircularContainer>
            }
            <GlobeContainer ref={globe} id="globe" >
              <World filterBy={globalState.filterBy} covid={diseaseData} cites={cities} height={window.innerHeight} width={window.innerWidth} disease={disease} />
            </GlobeContainer>
            <ChartsContainer>
              <Grid container spacing={3} direction="column">
                <Grid item xs={6}>
                  <Filter disease={disease} />
                </Grid>
                <Grid item xs={11}>
                  <Charts data={dataOverTime} filterBy={globalState.filterBy} disease={disease} />
                </Grid>
              </Grid>
            </ChartsContainer>
            <DetailsContainer>
              <Details disease={disease} />
            </DetailsContainer>
          </GridContainer>
        </ThemeProvider>       )
}

export default App
