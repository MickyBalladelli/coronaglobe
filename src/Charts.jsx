import React, { useState, useEffect } from "react"
import { styled } from "@mui/material/styles"
import useCustom from './CustomHooks'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const RootContainer = styled('div')({
      'z-index':        1000,
    height:            '250px',
    width:             '90%',
    backgroundColor: 'transparent',
    opacity:           1,
    })

export default function Charts (props) {
  const [globalState, ] = useCustom()
  const [data, setData] = useState([])  
  
  useEffect(() => {
    if (globalState.selected) {
      const countryData = props.data.filter((i) => i.location === globalState.selected.country)
      getData(countryData)
         }
       }, [globalState.selected, props.data])  

  function getData(d) {
    if (props.disease === 'hanta') {
        // Hantavirus time series format
      const data = d.map((i) => {
        const o = {
          date:           i.date,
          new_cases:      i.new_cases,
          new_deaths:     i.new_deaths,
          total_cases:    i.total_cases,
          total_deaths:   i.total_deaths,
           }
        return o
          })
      setData(data)
        } else {
        // COVID-19 time series format (original)
      const data = d.map((i) => {
        const o = {
          date:                   i.date,
          new_cases:              i.new_cases,
          new_deaths:             i.new_deaths,
          total_cases:            i.total_cases,
          total_deaths:           i.total_deaths,
          icu_patients:           i.icu_patients,
          hosp_patients:          i.hosp_patients,
          new_cases_per_million:  i.new_cases_per_million,
          new_deaths_per_million: i.new_deaths_per_million,
           }
        return o
          })
      setData(data)
        }
     }

  return (
        <>
        { globalState.selected !== null && globalState.selected !== undefined &&   
          <RootContainer>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
              width={500}
              height={300}
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
                 }}
              >
                <CartesianGrid strokeDasharray="1 1" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="new_cases" stroke="#8884d8" />
                <Line type="monotone" dataKey="new_deaths" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </RootContainer>
        }
        </>
      )
    }
