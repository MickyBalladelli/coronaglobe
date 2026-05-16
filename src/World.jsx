import { useEffect, useRef } from 'react'
import { styled } from '@mui/material/styles'
import Globe from 'react-globe.gl'
import useCustom from './CustomHooks'
import * as d3 from 'd3'

const GlobeWrapper = styled('div')({
  position: 'relative !important',
})

const World = (props) => {
  const globeEl = useRef()
  const [, setGlobalState] = useCustom()

  useEffect(() => {
    if (globeEl && globeEl.current) {
      globeEl.current.pointOfView({ altitude: 8 }, 0)
     }
   }, [])

   // Handle window resize
   useEffect(() => {
     const handleResize = () => {
       if (globeEl && globeEl.current) {
         globeEl.current.camera().aspect = window.innerWidth / window.innerHeight
         globeEl.current.camera().updateProjectionMatrix()
         globeEl.current.renderer().setSize(window.innerWidth, window.innerHeight)
       }
     }
     window.addEventListener('resize', handleResize, false)
     return () => window.removeEventListener('resize', handleResize, false)
   }, [])

   let autoRotateTimer = null

   function onGlobeReady(globeInstance) {
     if (!globeInstance) return
     const controls = globeInstance.controls()
     
     if (controls) {
       controls.autoRotate = true
       controls.autoRotateSpeed = -0.2
     }
     
     const resetAutoRotate = () => {
       clearTimeout(autoRotateTimer)
       autoRotateTimer = setTimeout(() => {
         controls.autoRotate = true
       }, 3000)
     }
     
     const disableAutoRotate = () => {
       controls.autoRotate = false
       resetAutoRotate()
     }
     
     // Listen for control events to disable auto-rotate during interaction
     controls.addEventListener('start', () => {
       controls.autoRotate = false
     })
     
     controls.addEventListener('end', () => {
       resetAutoRotate()
     })
   }

   function onClick(element) {
     setGlobalState({selected: element})
   }
    function onHover(element) {
      /*if (element) {
      setGlobalState({selected: element})
       }*/
    }
    
    // Function to handle hanta data specifically
    function getHantaPolygonAltitude(d) {
      // For hantavirus data, we need to use the appropriate fields
      if (d.confirmed && d.deaths) {
        // When disease is hanta, we should use confirmed cases for altitude
        // The hanta data has confirmed and deaths fields directly
        const rawValue = parseInt(d.confirmed) || 0;
        // Apply a reasonable scaling factor to make differences visible
        const altitude = Math.max(0.01, rawValue * 0.00005); // Scale to make differences visible
        return altitude;
      }
      return 0.01;
    }
    
    function getHantaPolygonCapColor(d) {
      // For hantavirus data, we want to color based on confirmed cases
      if (d.confirmed && d.deaths) {
        const confirmed = parseInt(d.confirmed) || 0;
        // Simple color scale based on confirmed cases
        const normalized = Math.min(1, confirmed / 10); // Normalize to make color differences visible
        // Use a red color scale for hantavirus data
        return d3.interpolateReds(normalized);
      }
      return 'rgba(0, 100, 0, 0.15)';
    }
    
    function getHantaPolygonLabel(d) {
      if (d.confirmed && d.deaths) {
        return `${d.country}: Confirmed: ${d.confirmed}, Deaths: ${d.deaths}`;
      }
      return `${d.country}: no data`;
    }
    
 console.log('Rendering World with props:', props)
   return (
      <GlobeWrapper> 
         {props.data && props.cites && props.width !== 0 && props.height !== 0 &&
           <Globe          
           height={props.height}
           width={props.width}
           ref={globeEl}
           globeImageUrl="/earth-night.jpg"
           bumpImageUrl="/earth-topology.png"
           backgroundImageUrl="/night-sky.png"
           
            polygonsData={props.data}
             polygonAltitude={d => {
               if (props.disease === 'hanta') {
                 // Special handling for hantavirus data
                 return getHantaPolygonAltitude(d);
               } else {
                 // For COVID data, use the existing logic
                 if (d[props.filterBy]) {
                   if (props.filterBy === 'total_cases') {
                     // For hantavirus data, use raw total_cases value for better visualization
                     if (typeof d[props.filterBy] === 'object' && d[props.filterBy] !== null && d[props.filterBy].altitude !== undefined) {
                       // Already processed data with altitude - use it directly
                       return Math.max(0.01, d[props.filterBy].altitude);
                     } else {
                       // Use the raw value from the hantavirus data for proper scaling
                       const rawValue = d.raw_total_cases;
                       // Apply a reasonable scaling factor to make differences visible
                       const altitude = Math.max(0.01, rawValue * 0.00005); // Scale to make differences visible
                       return altitude;
                     }
                   } else if (props.filterBy === 'total_deaths' || props.filterBy === 'cfr' || props.filterBy === 'cases_per_million') {
                     // For other hantavirus fields, also use direct scaling
                     if (typeof d[props.filterBy] === 'object' && d[props.filterBy] !== null && d[props.filterBy].altitude !== undefined) {
                       return Math.max(0.01, d[props.filterBy].altitude);
                     } else {
                       // For hantavirus data, use raw values for better scaling
                       return Math.max(0.01, d[props.filterBy]); // Use raw value directly
                     }
                   } else {
                     // For other cases (COVID), use the existing altitude logic
                     return d[props.filterBy].altitude;
                   }
                 }
                 return 0.01;
               }
             }}
            polygonCapColor={d => {
              if (props.disease === 'hanta') {
                // Special handling for hantavirus data
                return getHantaPolygonCapColor(d);
              } else {
                // For COVID data, use the existing logic
                return d[props.filterBy] ? d[props.filterBy].color : 'rgba(0, 100, 0, 0.15)';
              }
            }}
            polygonSideColor={() => 'rgba(0, 255, 255, 0.15)'}
            polygonLabel={d => {
              if (props.disease === 'hanta') {
                // Special handling for hantavirus data
                return getHantaPolygonLabel(d);
              } else {
                // For COVID data, use the existing logic
                return d[props.filterBy] ? `${d.country}: ${d[props.filterBy].value}` : `${d.country}: no value`;
              }
            }}
           polygonsTransitionDuration={1000}
           onPolygonClick={onClick}
           onPolygonHover={onHover}
           onGlobeReady={onGlobeReady}
           pointOfView={{altitude: 8, ms: 0}}
           
           />
         }
      </GlobeWrapper>
     )
}
export default World
