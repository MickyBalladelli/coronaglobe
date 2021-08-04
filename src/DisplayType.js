import React from 'react'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import useCustom from './CustomHooks'

export default function DisplayType() {
  const [, setGlobalState] = useCustom()

  const handleRadioChange = (event) => {    
    setGlobalState({ format: event.target.value})
  }
  return (
    <FormControl component="fieldset">
      <RadioGroup row aria-label="position" name="position" defaultValue="Polygons">
        <FormControlLabel value="Lines" control={<Radio color="primary" />} label="Lines" onChange={handleRadioChange}/>
        <FormControlLabel value="Polygons" control={<Radio color="primary" />} label="Polygons" onChange={handleRadioChange}/>
      </RadioGroup>
    </FormControl>
  )
}