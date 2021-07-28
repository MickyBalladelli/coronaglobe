import { useState, useEffect, useRef } from 'react'
import Globe from 'react-globe.gl'
import { csvToArray } from '../utils/utils.js'
import * as d3 from 'd3'
import { csvParse } from 'd3'

// values for prop filterBy can be total cases, new cases, total deaths, new deaths, icu patients, hosp patients
const World = (props) => {
  const globeEl = useRef()
  const [places, setPlaces] = useState([])
  const [covid, setCovid] = useState([])
  
  const OPACITY = 0.22

  useEffect(() => {
    fetch('/datasets/ne_110m_populated_places_simple.geojson')
    .then(res => res.json())
    .then(({ features }) => setPlaces(features)
    )
  }, [])
  useEffect(() => {
    Promise.all([
      fetch('/owid/owid-covid-latest.csv')
        .then(res => res.text())
        .then(d =>  csvToArray(d, ',')),
      fetch('/datasets/countries.json')
        .then(res => res.json())
        .then(d => { 
          return d
        })
    ]).then(([covidData, countryData]) => {
      const combinedData = []
      let maxValue = 0
      let minValue = 10000000000

      covidData.forEach(function(item) {
        
        if (item.continent) {
          switch(props.filterBy){
            case "new cases": 
              if (item.new_cases > maxValue) {
                maxValue = item.new_cases
              }
              if (item.new_cases < minValue) {
                minValue = item.new_cases
              }
              break
            case "total deaths": 
              if (item.total_deaths > maxValue) {
                maxValue = item.total_deaths
              }
              if (item.total_deaths < minValue) {
                minValue = item.total_deaths
              }
              break
            case "new deaths": 
              if (item.new_deaths > maxValue) {
                maxValue = item.new_deaths
              }
              if (item.new_deaths < minValue) {
                minValue = item.new_deaths
              }
              break
            case "icu patients": 
              if (item.icu_patients > maxValue) {
                maxValue = item.icu_patients
              }
              if (item.icu_patients < minValue) {
                minValue = item.icu_patients
              }
              break
            case "hosp patients":
              if (item.hosp_patients > maxValue) {
                maxValue = item.hosp_patients
              }
              if (item.hosp_patients < minValue) {
                minValue = item.hosp_patients
              }
              break  
            case "total cases": 
            default:
              if (item.total_cases > 0) {
                if (item.total_cases > maxValue) {
                  maxValue = item.total_cases
                }
                if (item.total_cases < minValue) {
                  minValue = item.total_cases
                }
                //console.log("minValue", minValue, "maxValue", maxValue, "item.total_cases", item.total_cases)
                //console.log("minValue", typeof minValue, "maxValue", typeof maxValue, "item.total_cases", typeof item.total_cases)
                
              }

              break
          }       
        }
      })
      

      covidData.forEach(function(item) {
        let filterValue = 0
        switch(props.filterBy){
          case "new cases": 
            filterValue = item.new_cases
            break
          case "total deaths": 
            filterValue = item.total_deaths
            break
          case "new deaths": 
            filterValue = item.new_deaths
            break
          case "icu patients": 
            filterValue = item.icu_patients
            break
          case "hosp patients":
            filterValue = item.hosp_patients
            break  
          case "total cases": 
          default:
            filterValue = item.total_cases
            break
        }       

        if (filterValue > 0) {
          let c = {}
          for (let i = 0; i < countryData.length; i++){
            if (countryData[i].country === item.location){            
              c = countryData[i]
              break
            }
          }
          if (c.country !== undefined && maxValue > 0) {          

            // normalize to n = (x - minValue) / (maxValue - minValue)
            const normalized = (filterValue - minValue)/(maxValue - minValue)
            let altitude = normalized * 3 < 2 ? normalized * 3 : 2
console.log("altitude", altitude, "country",  c.country)
            if (altitude <= 0) {
              altitude = 0.1
            }
            const o = {
              country: c.country,
              lat:     c.lat,
              lng:     c.lng,
              value:   filterValue,
              label:   props.filterBy,
              // Calc color from a range of 0 to 1              
              color:   d3.interpolateYlOrRd(normalized * 3),
              // Same for altitude, go from 0 to 1
              altitude: altitude,
            }
            combinedData.push(o)
          }
        }
      })
      console.log("combinedData", combinedData)
      setCovid(combinedData)
    })    
  }, [])

  useEffect(() => {
    // Auto-rotate
    globeEl.current.controls().autoRotate = true
    globeEl.current.controls().autoRotateSpeed = -0.5
  }, [])
  
  return (
    <Globe
      ref={globeEl}
      globeImageUrl="/earth-night.jpg"
      bumpImageUrl="/earth-topology.png"
      backgroundImageUrl="/night-sky.png"

      arcsData={covid}
      arcLabel={d => `${d.country}: ${d.label} ${d.value} ${d.altitude}`}
      arcStartLat={d => +d.lat}
      arcStartLng={d => +d.lng}
      arcEndLat={d => +d.lat}
      arcEndLng={d => +d.lng}
      arcDashLength={1.0}
      arcDashGap={0}
      arcDashInitialGap={() => Math.random()}
      arcDashAnimateTime={2000}
      arcColor={d => d.color}
      arcsTransitionDuration={0}
      arcAltitude={d => d.altitude}
      arcStroke={2}

      pointsData={covid}
      pointLabel={d => `${d.country}: ${d.total_cases}`}
      pointColor={() => 'orange'}
      pointAltitude={0}
      pointRadius={0.5}
      pointsMerge={true}


      labelsData={places}
      labelLat={d => d.properties.latitude}
      labelLng={d => d.properties.longitude}
      labelText={d => d.properties.name}
      labelSize={d => Math.sqrt(d.properties.pop_max) * 4e-4}
      labelDotRadius={d => Math.sqrt(d.properties.pop_max) * 4e-4}
      labelColor={() => 'rgba(255, 165, 0, 0.75)'}
      labelResolution={2}
    />
  )
}
export default World
