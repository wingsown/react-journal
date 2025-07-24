import "./index.css"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import List from "./components/List"
import Home from "./components/Home"
import Journal from "./components/Journal"
import Photos from "./components/Photos"
import Archives from "./components/Archives"

function AppLayout() {
  const location = useLocation()
  const isPhotosPage = location.pathname === "/photos"

  return (
    <>
      <Header />
      <div className={isPhotosPage ? "main" : "main container"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/archives" element={<Archives />} />
          <Route path="/archives/:year" element={<List />} />
          <Route path="/blogs/:id" element={<Journal />} />
          <Route path="/archives/blogs/:id" element={<Journal />} />
          <Route path="/archives/:year/blogs/:id" element={<Journal />} />
          <Route path="/photos" element={<Photos />} />
        </Routes>
      </div>
      <Footer />
    </>
  )
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  )
}

export default App
