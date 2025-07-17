import React from "react"
import Folder from "./Folder"
import "../assets/css/List.css" // for .blog-preview h2 style

const Archives: React.FC = () => {
  return (
    <section className="section">
      <div className="container">
        <h2>Archives</h2>
      </div>
      <Folder />
    </section>
  )
}

export default Archives
