import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import FullscreenIcon from '@material-ui/icons/Fullscreen'
import useCustom from './CustomHooks'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },  
}))

export default function Fullscreen() {
  const classes = useStyles()
  const [globalState, ] = useCustom()

  const handleClick = () => {
    if (globalState && globalState.handle) {
      globalState.handle.enter()
    }
  }
  return (
    <div className={classes.root}>
      <Button variant="outlined" startIcon={<FullscreenIcon />} onClick={handleClick}>
        Full Screen
      </Button>
    </div>
  )
}