import logo from './logo.svg'
import './App.css'

function App() {

  fetch('/data/19a91d64-3cd3-42fc-9943-d635491a4d76')
  .then(response => {
    
    var pathname = new URL(response.url).pathname

    fetch('/staticdata' + pathname)
    .then(response => {
      console.log(response)
      return response.text()
    })
    .then(data => console.log(data))
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
