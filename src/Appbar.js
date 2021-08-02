import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import DisplayType from './DisplayType'
import Filter from './Filter'
import Fullscreen from './Fullscreen'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: '#fff',
    color: '#3B3131',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}))

export default function Appbar() {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <AppBar position="static" color="inherit" >
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Coronavirus Globe
          </Typography>
          <Fullscreen/>
          <Filter />
          <DisplayType />
        </Toolbar>
      </AppBar>
    </div>
  )
}