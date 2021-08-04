import React, { useEffect, useState } from "react"
import { makeStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import { ParametricBufferGeometry } from "three"

const useStyles = makeStyles({
  fixed: {
    'z-index':   1000,
    position:    'absolute',
    bottom:      0,
    width:       '450px',
    height:      '200px',
    marginLeft:  'auto',
    marginRight: 'auto',
    opacity:     0.7,
    pointerEvents: 'none',
  },
  typo: {
    pointerEvents: 'auto',
    marginLeft: 30,
  }
})
function useInterval(callback, delay, param) {
  const savedCallback = React.useRef()

  // Remember the latest callback.
  React.useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  React.useEffect(() => {
    function tick() {
      savedCallback.current()
    }
    if (delay !== null) {
      let id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay], param)
}

const MAX_ELEMENTS = 8

export default function Console (props) {
  const classes = useStyles()
  const [current, setCurrent] = useState(0)
  const [consoleData, setConsoleData] = useState([])

  useInterval(() => { 
    
    if (props.covid && props.covid.length > 0) {
      let dataType = ''
      switch(props.filterBy){
        default:
        case 'new_cases':
          dataType = 'new cases'
          break
        case 'new_deaths':
          dataType = 'new deaths'
          break  
        case 'total_cases':
          dataType = 'total cases'
          break
        case 'hosp_patients':
          dataType = 'hosp patients'
          break
        case 'icu_patients':
          dataType = 'ICU patients'
          break
        case 'total_deaths':
          dataType = 'total deaths'
          break
      }
      const d = props.covid[current]
      let element = {}
      if (d[props.filterBy] !== null && d[props.filterBy] !== undefined) {
        element = {
          text:  `${d.date} ${d.country} ${dataType} ${d[props.filterBy].value}`,
          color: d[props.filterBy].color,
        }
      } 
      else {
        element = {
          text:  `${d.date} ${d.country} ${dataType} no value`,
          color: '#fff',
        }
      }

      consoleData.push(element)
      setConsoleData(consoleData)
      if (consoleData.length > MAX_ELEMENTS ) {
        consoleData.shift()
      }

      if (current >= props.covid.length - 1) {
        setCurrent(() => 0)            
      }
      else {
        setCurrent(cur => cur + 1)
      }
    }
  }, 1000)  
  function getColor(c){
    if (c === 'rgb(128, 0, 38)') {
      return 'rgb(255, 0, 0)'      
    }
    else {
      return c
    }

  }

  return (
    <div className={classes.fixed} style={{ backgroundColor: "black" }}>
      {
        consoleData.map((i, index) => {
          return (
            <div key={index}> 
              <Typography style={{ color: getColor(i.color) }} className={classes.typo} variant="caption">{i.text}</Typography><br/>
            </div>
          )
        })
      }      
    </div>
  )
}