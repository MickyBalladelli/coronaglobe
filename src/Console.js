import React, { useEffect, useState } from "react"
import { makeStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"

const useStyles = makeStyles({
  fixed: {
    'z-index':   1000,
    position:    'absolute',
    bottom:      0,
    width:       '700px',
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

const MAX_ELEMENTS = 8

export default function Console (props) {
  const classes = useStyles()
  const [current, setCurrent] = useState(0)
  const [consoleData, setConsoleData] = useState([])
  useEffect(() => {

    if (props.covid && props.covid.length > 0) {
      setInterval(function(c){ 
        
        if (c && c.length > 0) {
          if (consoleData.length > MAX_ELEMENTS ) {
            consoleData.shift()
          }
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
          const d = c[current]

          if (d[props.filterBy] !== null) {
            const element = {
              text:  `${d.date} ${d.country} ${dataType} ${d[props.filterBy].value}`,
              color: c[props.filterBy].color,
            }
            console.log(element)
            consoleData.push(element)
            setConsoleData(consoleData)
            setCurrent(current++)

            if (current >= c.length) {
              setCurrent(0)
            }
          }
        }
      }, 1000, props.covid)  
    }
  }, [props.covid])
  
  return (
    <div className={classes.fixed} style={{ backgroundColor: "black" }}>
      <Typography style={{ color: '#fff' }} className={classes.typo} variant="caption">This text should be white</Typography><br/>
      <Typography style={{ color: '#fff' }} className={classes.typo} variant="caption">This text should be white2</Typography><br/>
      <Typography style={{ color: '#fff' }} className={classes.typo} variant="caption">This text should be white3</Typography><br/>
      <Typography style={{ color: '#fff' }} className={classes.typo} variant="caption">This text should be white4</Typography><br/>
      <Typography style={{ color: '#fff' }} className={classes.typo} variant="caption">This text should be white5</Typography><br/>
      <Typography style={{ color: '#fff' }} className={classes.typo} variant="caption">This text should be white6</Typography><br/>
      <Typography style={{ color: '#fff' }} className={classes.typo} variant="caption">This text should be white7</Typography><br/>
      <Typography style={{ color: '#fff' }} className={classes.typo} variant="caption">This text should be white8</Typography><br/>
      <Typography style={{ color: '#fff' }} className={classes.typo} variant="caption">This text should be white9</Typography><br/>
      <Typography style={{ color: '#fff' }} className={classes.typo} variant="caption">This text should be white10</Typography><br/>
    </div>
  )
}