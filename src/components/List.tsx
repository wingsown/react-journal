import React, { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import "../index.css"
import "../css/List.css"
import { BlogPost, blogPosts as fallbackPosts } from "../data/blogData"

const List: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [searchParams, setSearchParams] = useSearchParams()

  const entriesPerPage = 5
  const pageParam = parseInt(searchParams.get("page") || "1", 10)
  const [currentPage, setCurrentPage] = useState(pageParam)
  const [fadeClass, setFadeClass] = useState("fade-in")

  const handlePageChange = (page: number) => {
    setFadeClass("fade-out") // Start fade-out
    setTimeout(() => {
      setCurrentPage(page)
      setSearchParams({ page: page.toString() })
      setFadeClass("fade-in") // Then fade-in
    }, 200)
  }

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

  useEffect(() => {
    const pageFromURL = parseInt(searchParams.get("page") || "1", 10)
    setCurrentPage((prevPage) =>
      pageFromURL !== prevPage ? pageFromURL : prevPage
    )
  }, [searchParams])

  const indexOfLastPost = currentPage * entriesPerPage
  const indexOfFirstPost = indexOfLastPost - entriesPerPage
  const currentPosts = blogPosts.slice(indexOfFirstPost, indexOfLastPost)
  const totalPages = Math.ceil(blogPosts.length / entriesPerPage)

  return (
    <section className="section">
      <div className="blog-list container">
        <h2>Archive</h2>

        <div className={`blog-entries ${fadeClass}`} key={currentPage}>
          {currentPosts.map((blog) => (
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

        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={currentPage === i + 1 ? "active" : ""}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default List
