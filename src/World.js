// properties:
//   format, string, can be "lines" or "polygons"

import { useEffect, useRef } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Globe from 'react-globe.gl'
import useCustom from './CustomHooks'

const useStyles = makeStyles((theme) => ({
  root:{
    minHeight: '100%',
    height: '100%'
  },
}))

// values for prop filterBy can be total_cases, new_cases, total_deaths, new_deaths, icu_patients, hosp_patients
const World = (props) => {
  const globeEl = useRef()
  const classes = useStyles()
  const [globalState, setGlobalState] = useCustom()

  useEffect(() => {
    if (globeEl && globeEl.current) {
      globeEl.current.controls().autoRotate = true
      globeEl.current.controls().autoRotateSpeed = -0.2

      globeEl.current.pointOfView({ altitude: 6 }, 5000)
      window.addEventListener('resize', () => {
        globeEl.current.camera().aspect = window.innerWidth / window.innerHeight
        globeEl.current.camera().updateProjectionMatrix()
        globeEl.current.renderer().setSize(window.innerWidth, window.innerHeight)
      }, false)

    }
  }, [props.format])

  function onClick(element) {
    setGlobalState({selected: element})
  }

  function onHover(element) {
    setGlobalState({selected: element})
  }
  return (
    <div className={classes.root}>
      {props.covid && props.cites && props.format === 'Lines' &&
        <Globe
          ref={globeEl}
          globeImageUrl="/earth-night.jpg"
          bumpImageUrl="/earth-topology.png"
          backgroundImageUrl="/night-sky.png"

          arcsData={props.covid}
          arcDashLength={1}
          arcDashGap={1}
          arcDashInitialGap={0}
          arcDashAnimateTime={4000}
          arcsTransitionDuration={1000}
          arcStroke={2}
          arcStartLat={d => +d.lat}
          arcStartLng={d => +d.lng}
          arcEndLat={d => +d.lat}
          arcEndLng={d => +d.lng}
          arcLabel={d =>  d[props.filterBy] ? `${d.country}: ${d[props.filterBy].value}` : `${d.country}: 0`}
          arcColor={d => d[props.filterBy] ? d[props.filterBy].color : '#fff'}
          arcAltitude={d =>  d[props.filterBy] ? d[props.filterBy].altitude : 0.0000000001}

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
      {props.format === 'Polygons' && props.covid && props.cites &&
        <Globe
          ref={globeEl}
          globeImageUrl="/earth-night.jpg"
          bumpImageUrl="/earth-topology.png"
          backgroundImageUrl="/night-sky.png"

          polygonsData={props.covid}
          polygonAltitude={d => d[props.filterBy] ? d[props.filterBy].altitude : 0.01}
          polygonCapColor={d => d[props.filterBy] ? d[props.filterBy].color : 'rgba(0, 100, 0, 0.15)'}
          polygonSideColor={() => 'rgba(0, 255, 255, 0.15)'}
          polygonLabel={d =>  d[props.filterBy] ? `${d.country}: ${d[props.filterBy].value}` : `${d.country}: no value` }
          polygonsTransitionDuration={1000}
          onPolygonClick={onClick}
          onPolygonHover={onHover}
        />

      }
    </div>
  )
}
export default World