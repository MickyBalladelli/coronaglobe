import React from "react"
import { styled } from "@mui/material/styles"
import Typography from "@mui/material/Typography"
import useCustom from './CustomHooks'

const RootContainer = styled('div')({
      'z-index':     2000,
    height:         '300px',
    width:          '90%',
    backgroundColor: 'transparent',
    opacity:        1,
    pointerEvents:  'none',
     })

const Typo = styled(Typography)({
  pointerEvents: 'auto',
  marginLeft: 30,
    })

export default function Details (props) {
  const [globalState, ] = useCustom()

  function getColor(c){
    if (c === 'rgb(128, 0, 38)') {
      return 'rgb(255, 0, 0)'      
          }
    else {
      return c
          }
        }

  const selected = globalState.selected

  if (!selected || selected === undefined) {
    return <RootContainer></RootContainer>
       }

    // Hantavirus-specific display
  if (props.disease === 'hanta') {
    return (
          <RootContainer>
            <div>    
              <Typo style={{ "color": '#fff' }} variant="h4">{selected.country}</Typo><br/>
              <Typo style={{ "color": '#fff' }} variant="caption">Last updated: {selected.date}</Typo><br/>
              {selected.total_cases &&
              <div>
                <Typo style={{ "color": getColor(selected.total_cases.color) }} variant="caption">Total cases: {selected.total_cases.value}</Typo><br/>
                </div>
              }
              {selected.total_deaths &&
              <div>
                <Typo style={{ "color": getColor(selected.total_deaths.color) }} variant="caption">Total deaths: {selected.total_deaths.value}</Typo><br/>
                </div>
              }
              {selected.cfr &&
              <div>
                <Typo style={{ "color": getColor(selected.cfr.color) }} variant="caption">Case Fatality Rate: {selected.cfr.value}%</Typo><br/>
                </div>
              }
              {selected.cases_per_million &&
              <div>
                <Typo style={{ "color": getColor(selected.cases_per_million.color) }} variant="caption">Cases per million: {selected.cases_per_million.value}</Typo><br/>
                </div>
              }
              {selected.primary_virus &&
              <div>
                <Typo style={{ "color": '#4fc3f7' }} variant="caption">Primary virus: {selected.primary_virus}</Typo><br/>
                </div>
              }
              {selected.rodent_reservoir &&
              <div>
                <Typo style={{ "color": '#81c784' }} variant="caption">Rodent reservoir: {selected.rodent_reservoir}</Typo><br/>
                </div>
              }
              {selected.endemic_since &&
              <div>
                <Typo style={{ "color": '#ffb74d' }} variant="caption">Endemic since: {selected.endemic_since}</Typo><br/>
                </div>
              }
            </div> 
          </RootContainer>
         )
        }

    // COVID-19 display (original)
  return (
        <RootContainer>
          { globalState.selected !== null && globalState.selected !== undefined &&
            <div>    
              <Typo style={{ "color": '#fff' }} variant="h4">{globalState.selected.country}</Typo><br/>
              <Typo style={{ "color": '#fff' }} variant="caption">Last updated: {globalState.selected.date}</Typo><br/>
              {globalState.selected.new_cases &&
              <div>
                <Typo style={{ "color": getColor(globalState.selected.new_cases.color) }} variant="caption">New cases: {globalState.selected.new_cases.value}</Typo><br/>
                </div>
              }
              {globalState.selected.new_deaths &&
              <div>
                <Typo style={{ "color": getColor(globalState.selected.new_deaths.color) }} variant="caption">New deaths: {globalState.selected.new_deaths.value}</Typo><br/>
                </div>
              }
              {globalState.selected.icu_patients &&
              <div>
                <Typo style={{ "color": getColor(globalState.selected.icu_patients.color) }} variant="caption">ICU patients: {globalState.selected.icu_patients.value}</Typo><br/>
                </div>
              }
              {globalState.selected.hosp_patients &&
              <div>
                <Typo style={{ "color": getColor(globalState.selected.hosp_patients.color) }} variant="caption">Hospitalized patients: {globalState.selected.hosp_patients.value}</Typo><br/>
                </div>
              }
              {globalState.selected.total_deaths &&
              <div>
                <Typo style={{ "color": getColor(globalState.selected.total_deaths.color) }} variant="caption">Total deaths: {globalState.selected.total_deaths.value}</Typo><br/>
                </div>
              }
              {globalState.selected.total_cases &&
              <div>
                <Typo style={{ "color": getColor(globalState.selected.total_cases.color) }} variant="caption">Total cases: {globalState.selected.total_cases.value}</Typo><br/>
                </div>
              }   
              {globalState.selected.new_cases_per_million &&
                <div>
                  <Typo style={{ "color": getColor(globalState.selected.new_cases_per_million.color) }} variant="caption">New cases per million: {globalState.selected.new_cases_per_million.value}</Typo><br/>
                  </div>
              }   
              {globalState.selected.new_deaths_per_million &&
                  <div>
                    <Typo style={{ "color": getColor(globalState.selected.new_deaths_per_million.color) }} variant="caption">New deaths per million: {globalState.selected.new_deaths_per_million.value}</Typo><br/>
                    </div>
              }   
            </div> 
          }
        </RootContainer>
       )
     }
