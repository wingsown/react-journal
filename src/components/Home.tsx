import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import "../index.css"
import "../assets/css/List.css"
import { BlogPost } from "../types/blogData"

import { collection, getDocs, query, orderBy, limit } from "firebase/firestore"
import { db } from "../firebase"

const Home: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [fadeClass, setFadeClass] = useState("fade-in")

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogQuery = query(
          collection(db, "blogs"),
          orderBy("date", "desc")
        )
        const snapshot = await getDocs(blogQuery)
        const blogData = snapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            title: data.title,
            summary: data.summary,
            content: data.content,
            countryEmoji: data.countryEmoji,
            year: data.year,
          }
        }) as BlogPost[]
        setBlogPosts(blogData)
      } catch (error) {
        console.error("Error fetching blog posts:", error)
      }
    }

    fetchBlogs()
  }, [])

  return (
    <section className="section">
      <div className="blog-list container">
        <h2>Latest</h2>

        <div className={`blog-entries ${fadeClass}`}>
          {blogPosts.map((blog) => (
            <div className="blog-preview" key={blog.id}>
              <Link to={`blogs/${blog.id}`}>
                <h2>{blog.title}</h2>
                <p>{blog.summary}</p>
                <div className="blog-meta">
                  <p>{blog.countryEmoji}</p>
                  <p>{blog.year}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Home
