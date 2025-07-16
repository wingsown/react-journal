import "./index.css"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import List from "./components/List"
import Home from "./components/Home"
import Journal from "./components/Journal"
import Photos from "./components/Photos"

import { preloader } from "./utils/preloader"

preloader()

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <div className="main container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/archives" element={<List />} />
            <Route path="/archives/blogs/:id" element={<Journal />} />
            <Route path="/blogs/:id" element={<Journal />} />
            <Route path="/photos" element={<Photos />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  )
}

export default App
