import React from "react"
import { Link } from "react-router-dom"
import "../index.css"
import "../css/List.css"

const List: React.FC = () => {
  return (
    <section className="section">
      <div className="blog-list container">
        <h2>Archive</h2>
        <div className="blog-preview">
          <Link to="/blog-post-path">
            <h2>title</h2>
            <p>summary</p>
            <p>🇵🇭</p>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default List
