//  filter allow selecting from one of the following values:
//       total_cases, new_cases, total_deaths, new_deaths, icu_patients, hosp_patients
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import useCustom from './CustomHooks'

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: 10,
    minWidth: 120,
  },
}))

export default function Filter() {
  const classes = useStyles()
  const [state, setState] = React.useState({ filter: "new_cases" })
  const [, setGlobalState] = useCustom()

  const handleChange = (event) => {    
    setState({filterBy: event.target.value})
    setGlobalState({filterBy: event.target.value})
  }

  return (
    <div>
      <FormControl className={classes.formControl}>
        <Select
          native
          value={state.filter}
          onChange={handleChange}
          inputProps={{
            name: 'filter',
            id: 'filter',
          }}
        >
          <option value={'new_cases'}>New cases</option>
          <option value={'new_deaths'}>New deaths</option>
          <option value={'total_cases'}>Total cases</option>
          <option value={'total_deaths'}>Total deaths</option>
          <option value={'icu_patients'}>ICU patients</option>
          <option value={'hosp_patients'}>Hospitalized patients</option>
        </Select>
      </FormControl>
   </div>
  )
}