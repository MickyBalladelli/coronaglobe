import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import useCustom from './CustomHooks'
import { ResponsiveStream } from '@nivo/stream'

const useStyles = makeStyles({
  root: {
    'z-index':   1000,
    position: 'absolute',
    left: '60%',
    right: '40%',
    bottom:      10,
    width:       '600px',
    height:      '400px',
    margin:  '0 auto',
    opacity:     0.7,
    pointerEvents: 'none',
  },
})
const data = [
  {
    "Raoul": 191,
    "Josiane": 38,
    "Marcel": 12,
    "René": 139,
    "Paul": 143,
    "Jacques": 13
  },
  {
    "Raoul": 44,
    "Josiane": 170,
    "Marcel": 126,
    "René": 71,
    "Paul": 167,
    "Jacques": 47
  },
  {
    "Raoul": 134,
    "Josiane": 122,
    "Marcel": 110,
    "René": 133,
    "Paul": 34,
    "Jacques": 64
  },
  {
    "Raoul": 115,
    "Josiane": 156,
    "Marcel": 83,
    "René": 52,
    "Paul": 154,
    "Jacques": 68
  },
  {
    "Raoul": 130,
    "Josiane": 199,
    "Marcel": 177,
    "René": 163,
    "Paul": 129,
    "Jacques": 145
  },
  {
    "Raoul": 133,
    "Josiane": 65,
    "Marcel": 105,
    "René": 105,
    "Paul": 161,
    "Jacques": 160
  },
  {
    "Raoul": 129,
    "Josiane": 173,
    "Marcel": 19,
    "René": 197,
    "Paul": 123,
    "Jacques": 67
  },
  {
    "Raoul": 28,
    "Josiane": 79,
    "Marcel": 163,
    "René": 58,
    "Paul": 26,
    "Jacques": 12
  },
  {
    "Raoul": 23,
    "Josiane": 10,
    "Marcel": 106,
    "René": 129,
    "Paul": 43,
    "Jacques": 40
  }
]
export default function Charts (props) {
  const classes = useStyles()  
  const [globalState, ] = useCustom()
  
  React.useEffect(() => {
    const countryData = props.data.filter((i) => i.location === globalState.selected.country)
    console.log(countryData)
  }, [globalState.selected])  


  function getColor(c){
    if (c === 'rgb(128, 0, 38)') {
      return 'rgb(255, 0, 0)'      
    }
    else {
      return c
    }

  }
  
  return (
    <div className={classes.root} style={{ backgroundColor: "black" }}>
    { globalState.selected !== null && globalState.selected !== undefined &&   
      <ResponsiveStream
        data={data}
        keys={[ 'Raoul', 'Josiane', 'Marcel', 'René', 'Paul', 'Jacques' ]}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
            orient: 'bottom',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: '',
            legendOffset: 36
        }}
        axisLeft={{ orient: 'left', tickSize: 5, tickPadding: 5, tickRotation: 0, legend: '', legendOffset: -40 }}
        offsetType="silhouette"
        colors={{ scheme: 'nivo' }}
        fillOpacity={0.85}
        borderColor={{ theme: 'background' }}
        defs={[
            {
                id: 'dots',
                type: 'patternDots',
                background: 'inherit',
                color: '#2c998f',
                size: 4,
                padding: 2,
                stagger: true
            },
            {
                id: 'squares',
                type: 'patternSquares',
                background: 'inherit',
                color: '#e4c912',
                size: 6,
                padding: 2,
                stagger: true
            }
        ]}
        fill={[
            {
                match: {
                    id: 'Paul'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'Marcel'
                },
                id: 'squares'
            }
        ]}
        dotSize={8}
        dotColor={{ from: 'color' }}
        dotBorderWidth={2}
        dotBorderColor={{ from: 'color', modifiers: [ [ 'darker', 0.7 ] ] }}
        legends={[
            {
                anchor: 'bottom-right',
                direction: 'column',
                translateX: 100,
                itemWidth: 80,
                itemHeight: 20,
                itemTextColor: '#999999',
                symbolSize: 12,
                symbolShape: 'circle',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemTextColor: '#000000'
                        }
                    }
                ]
            }
        ]}
      />
    }
    </div>
  )
}