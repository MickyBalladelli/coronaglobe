import * as d3 from 'd3'
import { csvToArray } from './utils.js'

export function getCityData(callback) {
  fetch('/datasets/cities.geojson')
  .then(res => res.json())
  .then(({ features }) => callback(features)
  )
}

export function getDataOverTime(callback) {
  fetch('https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.csv')
  .then(res => res.text())
  .then(d =>  csvToArray(d, ','))
  .then((d) => callback(d)
  )
}
export function getCovidData(callback) {  
  Promise.all([
    fetch('https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/latest/owid-covid-latest.csv')
      .then(res => res.text())
      .then(d =>  csvToArray(d, ',')),
    fetch('/datasets/countries.json')
      .then(res => res.json())
      .then(d => { 
        return d
      }),
    fetch('/datasets/countries.geojson')
      .then(res => res.json())
      .then(d => { 
        return d
      })

  ]).then(([covidData, countryData, countryGeoData]) => {            
    const combinedData = parseCovidData(covidData, countryData, countryGeoData) 
    callback(combinedData)
  })    
}

function computeMinMax(covidData, filterBy) {
  let maxValue = 0
  let minValue = 10000000000
  covidData.forEach(function(item) {      
    if (item.continent) {
      if (item[filterBy] > maxValue) {
        maxValue = item[filterBy]
      }
      if (item[filterBy] < minValue) {
        minValue = item[filterBy]
      }
    }
  })
  return [minValue, maxValue]
}
function parseCovidItem(item, filterBy, minValue, maxValue) {
  const filterValue = item[filterBy]
  if (filterValue > 0) {

      // normalize to n = (x - minValue) / (maxValue - minValue)
      const normalized = (filterValue - minValue)/(maxValue - minValue)
      let altitude = normalized * 3 < 2 ? normalized * 3 : 2

      if (altitude < 0.01) {
        altitude = 0.01
      }

      let o = {
        value:    filterValue,
        label:    filterBy,
        color:    d3.interpolateYlOrRd(normalized * 3),
        altitude: altitude,
      }
      
      return o
    
  }
  return null
}

function parseCovidData(covidData, countryData, countryGeoData) {
  const combinedData = []

  covidData.forEach(function(item) {

    let c = {}
    for (let i = 0; i < countryData.length; i++){
      if (countryData[i].country === item.location){            
        c = countryData[i]
        break
      }
    }

    let geo = {}
    for (let i = 0; i < countryGeoData.features.length; i++){
      if (countryGeoData.features[i].properties.NAME_CIAWF === item.location){            
        geo = countryGeoData.features[i]
        break
      }
    }

    if (geo.properties !== undefined && c.country !== undefined) {            

      const country = covidData.filter((i) => i.location === c.country)

      let o = {
        country:    c.country,
        lat:        c.lat,
        lng:        c.lng,
        geometry:   geo.geometry,
        bbox:       geo.bbox,
        properties: geo.properties,
        date:       country[0].last_updated_date
      }

      o = pushFilteredData(o, item, covidData, 'total_cases')
      o = pushFilteredData(o, item, covidData, 'new_cases')
      o = pushFilteredData(o, item, covidData, 'total_deaths')
      o = pushFilteredData(o, item, covidData, 'new_deaths')
      o = pushFilteredData(o, item, covidData, 'icu_patients')
      o = pushFilteredData(o, item, covidData, 'hosp_patients')
      /*if (o.properties.NAME_CIAWF === "Finland"){
        console.log(country)
      }*/
      combinedData.push(o)
    }
    else {
      //console.log("Error, country not found", item.location)
    }
  })

  return combinedData
}
function pushFilteredData(o, item, covidData, filterBy) {
  let [minValue, maxValue] = computeMinMax(covidData, filterBy) 
  if (maxValue > 0) {
    const itemData = parseCovidItem(item, filterBy, minValue, maxValue)
    o[filterBy] = itemData
    return o
  }
}