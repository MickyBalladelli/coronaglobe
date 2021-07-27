import { useState, useEffect, useRef } from 'react'
import Globe from 'react-globe.gl'
import * as d3 from "d3"

const World = () => {
  const globeEl = useRef()
  const [popData, setPopData] = useState([])

  useEffect(() => {
    // load data
    fetch('/datasets/world_population.csv').then(res => res.text())
    .then( csv => {
      console.log(csv)
      return d3.csvParse(csv, ({ lat, lng, pop }) => ({ lat: +lat, lng: +lng, pop: +pop }))
    })
    .then(setPopData)
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
  />
}

export default World