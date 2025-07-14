import "./index.css"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import List from "./components/List"
import Journal from "./components/Journal"

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <div className="main container">
          <Routes>
            <Route path="/" element={<List />} />
            <Route path="/blogs/:id" element={<Journal />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  )
}

export default App
