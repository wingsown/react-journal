import React, { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import "../index.css"
import "../assets/css/List.css"
import { BlogPost } from "../types/blogData"

import { collection, getDocs } from "firebase/firestore"
import { db } from "../firebase"

const List: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [searchParams, setSearchParams] = useSearchParams()

  const entriesPerPage = 5
  const pageParam = parseInt(searchParams.get("page") || "1", 10)
  const [currentPage, setCurrentPage] = useState(pageParam)
  const [fadeClass, setFadeClass] = useState("fade-in")
  const [error, setError] = useState<string | null>(null)

  const handlePageChange = (page: number) => {
    setFadeClass("fade-out")
    setTimeout(() => {
      setCurrentPage(page)
      setSearchParams({ page: page.toString() })
      setFadeClass("fade-in")
    }, 200)
  }

  // MOCK DATA
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const res = await fetch("http://localhost:3000/blogs")
  //       if (!res.ok) throw new Error("Server offline")
  //       const data = await res.json()
  //       setBlogPosts(data)
  //     } catch (err) {
  //       console.warn("Falling back to static data", err)
  //       setBlogPosts(fallbackPosts)
  //     }
  //   }
  //   fetchData()
  // }, [])

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const snapshot = await getDocs(collection(db, "blogs"))
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
        setError("Failed fetching blog posts 😢")
      }
    }
    fetchBlogs()
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

        {blogPosts.length > entriesPerPage && (
          <div className="pagination-wrapper">
            <button
              className="arrow"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              ‹
            </button>

            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={currentPage === i + 1 ? "active" : ""}
                  onClick={() => handlePageChange(i + 1)}
                  aria-label={`Go to page ${i + 1}`}
                />
              ))}
            </div>

            <button
              className="arrow"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              ›
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default List
