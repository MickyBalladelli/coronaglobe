import { useState, useEffect, useRef } from 'react'
import Globe from 'react-globe.gl'
import * as d3 from 'd3'
import indexBy from 'index-array-by'

const World = () => {
  const globeEl = useRef()
  const [places, setPlaces] = useState([])
  const [airports, setAirports] = useState([])
  const [routes, setRoutes] = useState([])
  
  const COUNTRY = 'United States'
  const OPACITY = 0.22

  const airportParse = ([airportId, name, city, country, iata, icao, lat, lng, alt, timezone, dst, tz, type, source]) => ({ airportId, name, city, country, iata, icao, lat, lng, alt, timezone, dst, tz, type, source });
  const routeParse = ([airline, airlineId, srcIata, srcAirportId, dstIata, dstAirportId, codeshare, stops, equipment]) => ({ airline, airlineId, srcIata, srcAirportId, dstIata, dstAirportId, codeshare, stops, equipment});


  useEffect(() => {
    fetch('/datasets/ne_110m_populated_places_simple.geojson')
    .then(res => res.json())
    .then(({ features }) => setPlaces(features)
    )    

  }, [])

  useEffect(() => {
    // load data
    Promise.all([
      fetch('/datasets/airports.dat').then(res => res.text())
        .then(d => d3.csvParseRows(d, airportParse)),
      fetch('/datasets/routes.dat').then(res => res.text())
        .then(d => d3.csvParseRows(d, routeParse))
    ]).then(([airports, routes]) => {

      const byIata = indexBy(airports, 'iata', false);

      const filteredRoutes = routes
        .filter(d => byIata.hasOwnProperty(d.srcIata) && byIata.hasOwnProperty(d.dstIata)) // exclude unknown airports
        .filter(d => d.stops === '0') // non-stop flights only
        .map(d => Object.assign(d, {
          srcAirport: byIata[d.srcIata],
          dstAirport: byIata[d.dstIata]
        }))
        .filter(d => d.srcAirport.country === COUNTRY && d.dstAirport.country !== COUNTRY); // international routes from country

        console.log(routes)
        console.log(filteredRoutes)
        console.log(airports)

      setAirports(airports)
      setRoutes(filteredRoutes)

      console.log(filteredRoutes)
    })
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

    arcsData={routes}
    arcLabel={d => `${d.airline}: ${d.srcIata} &#8594; ${d.dstIata}`}
    arcStartLat={d => +d.srcAirport.lat}
    arcStartLng={d => +d.srcAirport.lng}
    arcEndLat={d => +d.dstAirport.lat}
    arcEndLng={d => +d.dstAirport.lng}
    arcDashLength={0.25}
    arcDashGap={1}
    arcDashInitialGap={() => Math.random()}
    arcDashAnimateTime={4000}
    arcColor={d => [`rgba(0, 255, 0, ${OPACITY})`, `rgba(255, 0, 0, ${OPACITY})`]}
    arcsTransitionDuration={0}

    pointsData={airports}
    pointColor={() => 'orange'}
    pointAltitude={0}
    pointRadius={0.02}
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