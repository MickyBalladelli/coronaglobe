import logo from './logo.svg'
import './App.css'

function App() {

  function csvToArray(str, delimiter = ';') {
    // slice from start of text to the first \n index
    // use split to create an array from string by delimiter
    const headers = str.slice(0, str.indexOf('\n')).split(delimiter)
  
    // slice from \n index + 1 to the end of the text
    // use split to create an array of each csv value row
    const rows = str.slice(str.indexOf('\n') + 1).split('\n')
  
    // Map the rows
    // split values from each row into an array
    // use headers.reduce to create an object
    // object properties derived from headers:values
    // the object passed as an element of the array
    const arr = rows.map(function (row) {
      const values = row.split(delimiter)
      const el = headers.reduce(function (object, header, index) {
        object[header] = values[index]
        return object
      }, {})
      return el
    })
  
    // return the array
    return arr
  }


  fetch('/data/19a91d64-3cd3-42fc-9943-d635491a4d76')
  .then(response => {
    console.log(response)
    var pathname = new URL(response.url).pathname

    fetch('/staticdata' + pathname)
    .then(response => {
      console.log(response)
      return response.text()
    })
    .then(data => {
      const csv = csvToArray(data)
      console.log(csv)
    })
  })
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="animated-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  )
}

export default App
