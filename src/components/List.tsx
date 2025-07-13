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
            <h2>Taiwan, 2019</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <p>&#x1F1F9;&#x1F1FC;</p>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default List
