# Covid Globe

![Covid Globe](/project-images/covid-globe-flat.png)

The Covid Globe, a global view of Covid pandemia using Javascript and React.

Covid Globe is a React based Web application leveraging Vasco Asturiano globe.gl components [https://github.com/vasturiano/react-globe.gl](https://github.com/vasturiano/react-globe.gl) and COVID-19 Dataset by Our World in Data [https://github.com/owid/covid-19-data](https://github.com/owid/covid-19-data).

A polygon version of the globe can be selected:
![Polygons](/project-images/polygons.png)

Data can be filtered by:

* Total cases
* New cases
* Total deaths
* New deaths
* ICU patients
* Hospitalized patients

Note: Data by Our World in Data is updated daily.

TLDR; [Check this online demo at cloudno.de](http://coronaglobe.cloudno.de/)


## Getting started

Download the project in a folder of your choice, then, you can run:

### `npm i`

Followed by 

### `npm run build`

Builds the app for production to the `build` folder.\
Once the project has built you can start it by executing

### `node build/server.js`
