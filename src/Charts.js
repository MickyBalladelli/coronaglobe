import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import useCustom from './CustomHooks'

const useStyles = makeStyles({
  root: {
    'z-index':   1000,
    position: 'absolute',
    left: '60%',
    right: '40%',
    bottom:      0,
    width:       '600px',
    height:      '400px',
    margin:  '0 auto',
    opacity:     0.7,
    pointerEvents: 'none',
  },
})

export default function Charts (props) {
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
     
    </div>
  )
}