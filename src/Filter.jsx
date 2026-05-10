import React from 'react'
import { styled } from '@mui/material/styles'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import useCustom from './CustomHooks'

const FormControlStyled = styled(FormControl)({
  margin: 10,
  minWidth: 120,
})

export default function Filter({ disease }) {
  const [state, setState] = React.useState({ filter: "new_cases" })
  const [, setGlobalState] = useCustom()

  const handleChange = (event) => {    
    setState({ filter: event.target.value })
    setGlobalState({ filterBy: event.target.value })
     }

  const covidOptions = [
     { value: 'new_cases', label: 'New cases' },
     { value: 'new_deaths', label: 'New deaths' },
     { value: 'total_cases', label: 'Total cases' },
     { value: 'total_deaths', label: 'Total deaths' },
     { value: 'icu_patients', label: 'ICU patients' },
     { value: 'hosp_patients', label: 'Hospitalized patients' },
     { value: 'new_cases_per_million', label: 'New cases per million' },
     { value: 'new_deaths_per_million', label: 'New deaths per million' },
     ]

  const hantaOptions = [
     { value: 'total_cases', label: 'Total cases' },
     { value: 'total_deaths', label: 'Total deaths' },
     { value: 'cfr', label: 'Case Fatality Rate' },
     { value: 'cases_per_million', label: 'Cases per million' },
     ]

  const options = disease === 'hanta' ? hantaOptions : covidOptions

  return (
      <div>
        <FormControlStyled>
          <Select
          native
          value={state.filter}
          onChange={handleChange}
          inputProps={{
            name: 'filter',
            id: 'filter',
             }}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
          </Select>
        </FormControlStyled>
      </div>
    )
}
