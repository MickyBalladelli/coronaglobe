import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import useCustom from './CustomHooks'

const useStyles = makeStyles({
  root: {
    'z-index':   1000,
    position: 'absolute',
    left: '40%',
    right: '40%',
    bottom:      0,
    width:       '400px',
    height:      '200px',
    margin:  '0 auto',
    opacity:     0.7,
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
    <div className={classes.root} style={{ backgroundColor: "black" }}>
      { globalState.selected !== null && globalState.selected !== undefined &&        
        <div>
          <Typography style={{ "color": '#fff' }} className={classes.typo} variant="caption">{globalState.selected.country}</Typography><br/>
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
        </div>
      }      

    </div>
  )
}