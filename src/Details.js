import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import useCustom from './CustomHooks'

const useStyles = makeStyles({
  root: {
    'z-index':   2000,
    height:      '300px',
    width:       '90%',
    backgroundColor: 'transparent',
    opacity:     1,
    pointerEvents: 'none',
  },
  typo: {
    pointerEvents: 'auto',
    marginLeft: 30,
  }
})

export default function Details (props) {
  const classes = useStyles()  
  const [globalState, ] = useCustom()

  function getColor(c){
    if (c === 'rgb(128, 0, 38)') {
      return 'rgb(255, 0, 0)'      
    }
    else {
      return c
    }

  }

  return (
    <div classes={classes.root} style={{ backgroundColor: "black" }}>
      { globalState.selected !== null && globalState.selected !== undefined &&
        <div>    
          <Typography style={{ "color": '#fff' }} className={classes.typo} variant="h4">{globalState.selected.country}</Typography><br/>
          <Typography style={{ "color": '#fff' }} className={classes.typo} variant="caption">Last updated: {globalState.selected.date}</Typography><br/>
          {globalState.selected.new_cases &&
          <div>
            <Typography style={{ "color": getColor(globalState.selected.new_cases.color) }} className={classes.typo} variant="caption">New cases: {globalState.selected.new_cases.value}</Typography><br/>
          </div>
          }
          {globalState.selected.new_deaths &&
          <div>
            <Typography style={{ "color": getColor(globalState.selected.new_deaths.color) }} className={classes.typo} variant="caption">New deaths: {globalState.selected.new_deaths.value}</Typography><br/>
          </div>
          }
          {globalState.selected.icu_patients &&
          <div>
            <Typography style={{ "color": getColor(globalState.selected.icu_patients.color) }} className={classes.typo} variant="caption">ICU patients: {globalState.selected.icu_patients.value}</Typography><br/>
          </div>
          }
          {globalState.selected.hosp_patients &&
          <div>
            <Typography style={{ "color": getColor(globalState.selected.hosp_patients.color) }} className={classes.typo} variant="caption">Hospitalized patients: {globalState.selected.hosp_patients.value}</Typography><br/>
          </div>
          }
          {globalState.selected.total_deaths &&
          <div>
            <Typography style={{ "color": getColor(globalState.selected.total_deaths.color) }} className={classes.typo} variant="caption">Total deaths: {globalState.selected.total_deaths.value}</Typography><br/>
          </div>
          }
          {globalState.selected.total_cases &&
          <div>
            <Typography style={{ "color": getColor(globalState.selected.total_cases.color) }} className={classes.typo} variant="caption">Total cases: {globalState.selected.total_cases.value}</Typography><br/>
          </div>
          }   
          {globalState.selected.new_cases_per_million &&
            <div>
              <Typography style={{ "color": getColor(globalState.selected.new_cases_per_million.color) }} className={classes.typo} variant="caption">New cases per million: {globalState.selected.new_cases_per_million.value}</Typography><br/>
            </div>
          }   
          {globalState.selected.new_deaths_per_million &&
              <div>
                <Typography style={{ "color": getColor(globalState.selected.new_deaths_per_million.color) }} className={classes.typo} variant="caption">New deaths per million: {globalState.selected.new_deaths_per_million.value}</Typography><br/>
              </div>
          }   
        </div> 
      }
    </div>
  )
}