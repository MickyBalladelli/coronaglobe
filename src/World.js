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
  const [, setGlobalState] = useCustom()

  useEffect(() => {
    if (props.covid && globeEl && globeEl.current) {
      globeEl.current.controls().autoRotate = true
      globeEl.current.controls().autoRotateSpeed = -0.2

      globeEl.current.pointOfView({ altitude: 6 }, 5000)
      window.addEventListener('resize', () => {
        globeEl.current.camera().aspect = window.innerWidth / window.innerHeight
        globeEl.current.camera().updateProjectionMatrix()
        globeEl.current.renderer().setSize(window.innerWidth, window.innerHeight)
      }, false)
    }
  }, [props.covid])

  function onClick(element) {
    setGlobalState({selected: element})
  }
  function onHover(element) {
    /*if (element) {
      setGlobalState({selected: element})
    }*/
  }

  return (
    <div className={classes.root}>
      {props.covid && props.cites &&
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
