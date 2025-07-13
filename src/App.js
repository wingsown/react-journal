import "./index.css"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import Header from "./components/Header"

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
      </div>
    </Router>
  )
}

export default App
