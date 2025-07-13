import React, { use, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import "../index.css"
import "../css/List.css"
import { BlogPost, blogPosts as fallbackPosts } from "../data/blogData"

const List: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:3000/blogs")
        if (!res.ok) throw new Error("Server offline")
        const data = await res.json()
        setBlogPosts(data)
      } catch (err) {
        console.warn("Falling back to static data", err)
        setBlogPosts(fallbackPosts)
      }
    }
    fetchData()
  }, [])

  return (
    <section className="section">
      <div className="blog-list container">
        <h2>Archive</h2>
        {blogPosts.map((blog) => (
          <div className="blog-preview" key={blog.id}>
            <Link to={blog.path}>
              <h2>{blog.title}</h2>
              <p>{blog.summary}</p>
              <p>{blog.countryEmoji}</p>
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}

export default List
