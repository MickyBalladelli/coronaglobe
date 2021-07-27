import logo from './logo.svg'
import './App.css'
import { csvToArray } from './utils/utils.js'
import France from './react-departements/France'
import World from './Globe/world'
function App() {

  fetch('/data/19a91d64-3cd3-42fc-9943-d635491a4d76')
  .then(response => {    
    var pathname = new URL(response.url).pathname

    fetch('/staticdata' + pathname)
    .then(response => {
      return response.text()
    })
    .then(data => {
      const csv = csvToArray(data)
    })
  })
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="animated-logo" alt="logo" />
        <France departements={[75, 89, 21, 33, 47, 74, "2a", 976]} />

        <World/>
      </header>
    </div>
  )
}

export default App
