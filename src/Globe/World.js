import { useState, useEffect, useRef } from 'react'
import Globe from 'react-globe.gl'
import * as d3 from 'd3'
import indexBy from 'index-array-by'


const worldData = [
  {
    country: 'France',
    lat: 49.012798,
    lng: 2.55,
    value: 50000,
  },
  {
    country: 'Spain',
    lat: 40.471926,
    lng: -3.56264,
    value: 32000,
  },
]
const World = () => {
  const globeEl = useRef()
  const [places, setPlaces] = useState([])
  const [airports, setAirports] = useState([])
  const [routes, setRoutes] = useState([])
  
  const COUNTRY = 'United States'
  const OPACITY = 0.22

  useEffect(() => {
    fetch('/datasets/ne_110m_populated_places_simple.geojson')
    .then(res => res.json())
    .then(({ features }) => setPlaces(features)
    )    

  }, [])

  useEffect(() => {
    // Auto-rotate
    globeEl.current.controls().autoRotate = true
    globeEl.current.controls().autoRotateSpeed = -0.1
  }, [])

  
  return <Globe
    ref={globeEl}
    globeImageUrl="/earth-night.jpg"
    bumpImageUrl="/earth-topology.png"
    backgroundImageUrl="/night-sky.png"

    arcsData={worldData}
    arcLabel={d => `${d.country}: ${d.value}`}
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

    pointsData={worldData}
    pointLabel={d => `${d.country}: ${d.value}`}
    pointColor={() => 'orange'}
    pointAltitude={0.1}
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
}

export default World