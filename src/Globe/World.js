import { useEffect, useRef } from 'react'
import Globe from 'react-globe.gl'



const testData = [
  {
    altitude: 0.5003824422425229,
    color: "rgb(253, 137, 60)",
    country: "United Kingdom",
    label: "total cases",
    lat: "54.702355",
    lng: "-3.276575",
    value: 5771732,
  },
  {
    altitude: 2,
    color: "rgb(128, 0, 38)",
    country: "United States",
    label: "total cases",
    lat: "39.78373",
    lng: "-100.445882",
    value: 34603919,
  }
]

// values for prop filterBy can be total_cases, new_cases, total_deaths, new_deaths, icu_patients, hosp_patients
const World = (props) => {
  const globeEl = useRef()

  useEffect(() => {
    // Auto-rotate
    globeEl.current.controls().autoRotate = true
    globeEl.current.controls().autoRotateSpeed = -0.2
  }, [])
  
  return (
    <div>
      {props.covid && props.cites &&
        <Globe
          ref={globeEl}
          globeImageUrl="/earth-night.jpg"
          bumpImageUrl="/earth-topology.png"
          backgroundImageUrl="/night-sky.png"

          arcsData={props.covid}
          arcDashLength={1}
          arcDashGap={1}
          arcDashInitialGap={() => Math.random()}
          arcDashAnimateTime={4000}
          arcsTransitionDuration={0}
          arcStroke={2}
          arcStartLat={d => +d.lat}
          arcStartLng={d => +d.lng}
          arcEndLat={d => +d.lat}
          arcEndLng={d => +d.lng}
          arcLabel={d =>  d[props.filterBy] ? `${d.country}: ${d[props.filterBy].value}` : ''}
          arcColor={d => d[props.filterBy] ? d[props.filterBy].color : '#000'}
          arcAltitude={d =>  d[props.filterBy] ? d[props.filterBy].altitude : 0.1}

          pointsData={props.covid}
          pointColor={() => 'orange'}
          pointAltitude={0}
          pointRadius={0.5}
          pointsMerge={true}


          labelsData={props.cites}
          labelLat={d => d.properties.latitude}
          labelLng={d => d.properties.longitude}
          labelText={d => d.properties.name}
          labelSize={d => Math.sqrt(d.properties.pop_max) * 4e-4}
          labelDotRadius={d => Math.sqrt(d.properties.pop_max) * 4e-4}
          labelColor={() => 'rgba(255, 165, 0, 0.75)'}
          labelResolution={2}
        />
      }
    </div>
  )
}
export default World
