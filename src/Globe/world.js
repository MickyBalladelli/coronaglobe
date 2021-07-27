import { useState, useEffect, useRef } from 'react'
import Globe from 'react-globe.gl'
import * as d3 from "d3"

const World = () => {
  const globeEl = useRef()
  const [popData, setPopData] = useState([])
  const [places, setPlaces] = useState([])

  useEffect(() => {
    // load data
    fetch('/datasets/world_population.csv').then(res => res.text())
    .then( csv => {
      return d3.csvParse(csv, ({ lat, lng, pop }) => ({ lat: +lat, lng: +lng, pop: +pop }))
    })
    .then(setPopData)

    fetch('/datasets/ne_110m_populated_places_simple.geojson')
    .then(res => res.json())
    .then(({ features }) => setPlaces(features))
  }, [])

  useEffect(() => {
    // Auto-rotate
    globeEl.current.controls().autoRotate = true
    globeEl.current.controls().autoRotateSpeed = -0.9
  }, [])

  const weightColor = d3.scaleSequentialSqrt(d3.interpolateYlOrRd)
    .domain([0, 1e7])

  return <Globe
    ref={globeEl}
    globeImageUrl="/earth-night.jpg"
    bumpImageUrl="/earth-topology.png"
    backgroundImageUrl="/night-sky.png"

    hexBinPointsData={popData}
    hexBinPointWeight="pop"
    hexAltitude={d => d.sumWeight * 6e-8}
    hexBinResolution={4}
    hexTopColor={d => weightColor(d.sumWeight)}
    hexSideColor={d => weightColor(d.sumWeight)}
    hexBinMerge={true}
    enablePointerInteraction={false}

    labelsData={places}
    labelLat={d => d.properties.latitude}
    labelLng={d => d.properties.longitude}
    labelText={d => d.properties.name}
    labelSize={d => Math.sqrt(d.properties.pop_max) * 4e-4}
    labelDotRadius={d => Math.sqrt(d.properties.pop_max) * 4e-4}
    labelColor={() => 'rgba(255, 165, 0, 0.75)'}
    labelResolution={2}

  />
}

export default World