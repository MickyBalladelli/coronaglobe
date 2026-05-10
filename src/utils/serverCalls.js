import * as d3 from 'd3'
import { csvToArray } from './utils.js'

export function getCityData(callback) {
  fetch('/datasets/cities.geojson')
    .then(res => res.json())
    .then(({ features }) => callback(features)
    )
}

export function getCovidData(callback) {  
  Promise.all([
    fetch('https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/latest/owid-covid-latest.csv')
        .then(res => res.text())
        .then(d =>  csvToArray(d, ',')),
    fetch('/datasets/countries.json')
        .then(res => res.json())
        .then(d => d),
    fetch('/datasets/countries.geojson')
        .then(res => res.json())
        .then(d => d),
    fetch('https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.csv')
      .then(res => res.text())
      .then(d => csvToArray(d, ','))
      .then((d) => d)
    ]).then(([covidData, countryData, countryGeoData, dataOverTime]) => {            
    const combinedData = parseCovidData(covidData, countryData, countryGeoData) 
    callback(combinedData, dataOverTime)
    })    
}

export function getHantaData(callback) {
  Promise.all([
fetch('https://hantavirus.one/data/countries.json')
    .then(res => res.json())
    .then(d => d),
fetch('/datasets/countries.geojson')
         .then(res => res.json())
         .then(d => d),
      fetch('/datasets/hanta-time-series.json')
           .then(res => res.json())
           .then(d => d)
     ]).then(([hantaData, countryGeoData, dataOverTime]) => {
    const combinedData = parseHantaData(hantaData, countryGeoData)
    callback(combinedData, dataOverTime)
     })
}

function computeMinMax(data, filterBy) {
  let maxValue = 0
  let minValue = 10000000000
  data.forEach(function(item) {      
    if (item[filterBy] > maxValue) {
      maxValue = item[filterBy]
       }
    if (item[filterBy] < minValue) {
      minValue = item[filterBy]
       }
      }
    )
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
      o = pushFilteredData(o, item, covidData, 'new_cases_per_million')
      o = pushFilteredData(o, item, covidData, 'new_deaths_per_million')

      combinedData.push(o)
        }
    else {
        // console.log("Error, country not found", item.location)
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

function parseHantaData(hantaData, countryGeoData) {
  const combinedData = []

   // Compute min/max for normalization
  const [maxCases, minCases] = computeMinMax(hantaData, 'total_cases')
  const [maxDeaths, minDeaths] = computeMinMax(hantaData, 'total_deaths')
  const [maxCFR, minCFR] = computeMinMax(hantaData, 'cfr')
  const [maxPerMillion, minPerMillion] = computeMinMax(hantaData, 'cases_per_million')

  hantaData.forEach(function(item) {
    let geo = {}
    for (let i = 0; i < countryGeoData.features.length; i++) {
       // Match by country name or ISO code
      const prop = countryGeoData.features[i].properties
      if (prop.NAME_CIAWF === item.country || prop.ISO_A2 === item.iso || prop.ADM0_A3 === item.iso) {
        geo = countryGeoData.features[i]
        break
         }
        }

    if (geo.properties !== undefined) {
      let o = {
        country:    item.country,
        lat:        item.lat,
        lng:        item.lng,
        geometry:   geo.geometry,
        bbox:       geo.bbox,
        properties: geo.properties,
        date:       item.last_updated,
        total_cases:      normalizeValue(item.total_cases, minCases, maxCases),
        total_deaths:     normalizeValue(item.total_deaths, minDeaths, maxDeaths),
        cfr:              normalizeValue(item.cfr, minCFR, maxCFR),
        cases_per_million: normalizeValue(item.cases_per_million, minPerMillion, maxPerMillion),
         // Store raw values for display
        raw_total_cases:      item.total_cases,
        raw_total_deaths:     item.total_deaths,
        raw_cfr:              item.cfr,
        raw_cases_per_million: item.cases_per_million,
        endemic_since:    item.endemic_since,
        primary_virus:    item.primary_virus,
        rodent_reservoir: item.rodent_reservoir
         }

      combinedData.push(o)
        }
      })

  return combinedData
}

function normalizeValue(value, minVal, maxVal) {
  if (value > 0 && maxVal > 0) {
    const normalized = (value - minVal) / (maxVal - minVal)
    let altitude = normalized * 3 < 2 ? normalized * 3 : 2
    if (altitude < 0.01) {
      altitude = 0.01
        }
    return {
      value: value,
      label: 'total_cases',
      color: d3.interpolateYlOrRd(normalized * 3),
      altitude: altitude
        }
      }
  return null
}