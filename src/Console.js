import React from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

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
export default function Console () {
  const classes = useStyles()

  
  useEffect(() => {
    setTimeout(function(){ 
      
    }, 3000)  

  }, [])
  console.log(props.covid) //d[props.filterBy]
  return (
    <div className={classes.fixed} style={{ backgroundColor: "black" }}>
      <Typography style={{ color: '#fff' }} className={classes.typo} variant="caption">
        This text should be white
      </Typography>
    </div>
  )
}