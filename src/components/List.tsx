import React, { useEffect, useState } from "react"
import { Link, useSearchParams, useParams, useLocation } from "react-router-dom"
import "../index.css"
import "../assets/css/List.css"
import { BlogPost } from "../types/blogData"
import icon4 from "../assets/icons/Icon_4.png"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "../firebase"
import Blogs from "./Blogs"

interface ListProps {}

const List: React.FC<ListProps> = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [searchParams, setSearchParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fadeClass, setFadeClass] = useState("fade-in")
  const { year } = useParams()
  const filterYear = year ? parseInt(year, 10) : undefined

  const entriesPerPage = 5
  const pageParam = parseInt(searchParams.get("page") || "1", 10)
  const [currentPage, setCurrentPage] = useState(pageParam)

  const location = useLocation()
  const incomingView = location.state?.view
  const incomingFrom = location.state?.from

  const handlePageChange = (page: number) => {
    setFadeClass("fade-out")
    setTimeout(() => {
      setCurrentPage(page)
      setSearchParams({ page: page.toString() })
      setFadeClass("fade-in")
    }, 200)
  }

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
        const filtered = filterYear
          ? blogData.filter((post) => post.year === filterYear)
          : blogData
        setBlogPosts(filtered)
      } catch (error) {
        console.error("Error fetching blog posts:", error)
        setError("Failed fetching blog posts 😢")
      } finally {
        setLoading(false)
      }
    }
    fetchBlogs()
  }, [year])

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
      <div className="container">
        <h2>Archives</h2>

        {loading ? (
          <div className="preloader-content">
            <img src={icon4} className="loading-icon" alt="Loading..." />
          </div>
        ) : (
          <>
            <Blogs
              blogPosts={currentPosts}
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
              fadeClass={fadeClass}
            />

            <div className="archives-button-wrapper left">
              <Link to="/archives" className="archives-button">
                <span className="arrow-icon">←</span> Back to Archives
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default List
