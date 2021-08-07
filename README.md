# Corona Globe

[Online demo](http://coronaglobe.cloudno.de/)

![Corona Globe](/project-images/polygons.png)
Corona Globe, a global view of Covid pandemia using Javascript and React.

Corona Globe is a React based Web application leveraging Vasco Asturiano globe.gl components [https://github.com/vasturiano/react-globe.gl](https://github.com/vasturiano/react-globe.gl) and COVID-19 Dataset by Our World in Data [https://github.com/owid/covid-19-data](https://github.com/owid/covid-19-data).

Data can be filtered by:

* Total cases
* New cases
* Total deaths
* New deaths
* ICU patients
* Hospitalized patients

Note: Data by Our World in Data is updated daily.

When clicking on a country a detailed view appears

![Detailed view](/project-images/details.png)

## Getting started

Download the project in a folder of your choice, then, you can run:

### `npm i`

Followed by 

### `npm start`

If you want to generate a production build:

### `npm run build`

Builds the app in the `build` folder.\
Once the project has built you can start it by executing

### `node build/server.js`
