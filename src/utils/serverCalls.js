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
  // Fetch only from Vercel API route (avoids CORS issues)
  fetch('/api/hanta')
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      // Check if response is actually JSON by trying to parse it
      return res.text().then(text => {
        
        // Try to parse as JSON
        try {
          const jsonData = JSON.parse(text);
          return jsonData;
        } catch (e) {
          console.error('Failed to parse JSON from API:', e);
          throw new Error('Invalid JSON received from API');
        }
      });
    })
    .then(hantaData => {
      // Validate that the data is valid JSON and is an array
      if (!Array.isArray(hantaData)) {
        console.error('Invalid data received from API - expected an array, got:', typeof hantaData);        
      }
      // Additional validation: ensure the data is actually valid JSON
      try {
        // This will throw if data is not valid JSON
        JSON.stringify(hantaData);
      } catch (e) {
        console.error('Data is not valid JSON:', e);
        throw new Error('Data is not valid JSON');
      }
      console.log("Hanta data loaded via API route", hantaData)
      // Load country geo data for mapping
      fetch('/datasets/countries.geojson')
        .then(res => res.json())
        .then(countryGeoData => {
          const combinedData = parseHantaData(hantaData, countryGeoData)
          callback(combinedData) // No time series data for hanta
        })
        .catch(error => {
          console.error('Error loading country geo data for Hanta:', error)
          callback([])
        })
    })
    .catch(error => {
      console.error('Error loading Hanta data via API route:', error);
      callback([])
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
        //lat:        c.lat,
        //lng:        c.lng,
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

  // Check if hantaData is an array, if not try to extract the array
  
  // Convert remote data structure to local structure for consistency
  const convertedData = hantaData.map(item => {
    // Convert remote data structure to match local file structure
    return {
      ...item,
      lat: item.lat || 0,
      lng: item.lng || 0,
      total_cases: parseInt(item.confirmed) || 0,
      total_deaths: parseInt(item.deaths) || 0,      
      last_updated: new Date().toISOString().split('T')[0], // Current date
    };
  });

  // Compute min/max for normalization
  const [maxCases, minCases] = computeMinMax(convertedData, 'total_cases')
  const [maxDeaths, minDeaths] = computeMinMax(convertedData, 'total_deaths')
  const [maxCFR, minCFR] = computeMinMax(convertedData, 'cfr')
  const [maxPerMillion, minPerMillion] = computeMinMax(convertedData, 'cases_per_million')

  convertedData.forEach(function(item) {
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
        confirmed:  item.confirmed,
        deaths:     item.deaths,
        country:    item.country,
        iso:        item.iso,
        status:     item.status,
        source_url: item.source_url,
        geometry:   geo.geometry,
        bbox:       geo.bbox,
        properties: geo.properties,
        date:       item.last_updated,
      }

      combinedData.push(o)
    }
  })
  console.log("Combined Hanta data", combinedData)
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