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
          <option value={'new_cases_per_million'}>New cases per million</option>
          <option value={'new_deaths_per_million'}>New deaths per million</option>
        </Select>
      </FormControl>
   </div>
  )
}