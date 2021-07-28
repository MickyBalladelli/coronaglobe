import { useState, useEffect, useRef } from 'react'
import Globe from 'react-globe.gl'
import { csvToArray } from '../utils/utils.js'

// values for prop filterBy can be total_cases, new_cases, total_deaths, new_deaths, icu_patients, hosp_patients
const World = (filterBy="total_cases") => {
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

      switch(filterBy){
        case "new_cases": 
        break
        case "total_deaths": 
        break
        case "new_deaths": 
        break
        case "icu_patients": 
        break
        case "hosp_patients":
          break

        case "total_cases": 
        default:
          break
      }

      covidData.forEach(function(item){
        let c = {}
        for (let i = 0; i < countryData.length; i++){
          if (countryData[i].country === item.location){            
            c = countryData[i]
            break
          }
        }
        
        const o = {
          country:       c.country,
          lat:           c.lat,
          lng:           c.lng,
          total_cases:   item.total_cases,
          new_cases:     item.new_cases,
          total_deaths:  item.total_deaths,
          new_deaths:    item.new_deaths,
          icu_patients:  item.icu_patients,
          hosp_patients: item.hosp_patients,
        }
        combinedData.push(o)
      });

      setCovid(combinedData)
    })    
  }, [])

  useEffect(() => {
    // Auto-rotate
    globeEl.current.controls().autoRotate = true
    globeEl.current.controls().autoRotateSpeed = -0.1
  }, [])
  
  return (
    <Globe
      ref={globeEl}
      globeImageUrl="/earth-night.jpg"
      bumpImageUrl="/earth-topology.png"
      backgroundImageUrl="/night-sky.png"

      arcsData={covid}
      arcLabel={d => `${d.country}: ${d.total_cases}`}
      arcStartLat={d => +d.lat}
      arcStartLng={d => +d.lng}
      arcEndLat={d => +d.lat}
      arcEndLng={d => +d.lng}
      arcDashLength={1}
      arcDashGap={1}
      arcDashInitialGap={0.4}
      arcDashAnimateTime={0}
      arcColor={d => `rgba(0, 0, 255, ${OPACITY})`}
      arcsTransitionDuration={0}
      arcAltitude={d => 1}
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
      labelLabel={d => "toto"}


      //enablePointerInteraction={true}
      //pointerEventsFilter={ () => true }
    />
  )
}
export default World
