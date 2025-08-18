import React, { useEffect, useState } from "react"
import { Link, useSearchParams, useParams } from "react-router-dom"
import "../index.css"
import "../assets/css/List.css"
import { BlogPost } from "../types/blogData"
import icon4 from "../assets/icons/Icon_4.png"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "../firebase"
import Blogs from "./Blogs"
import Sort from "./Sort"
import Filter from "./Filter"
import { SortOrder } from "../utils/sortUtil"
import { filterByCountry } from "../utils/filterUtil"

const List: React.FC = () => {
  const [rawPosts, setRawPosts] = useState<BlogPost[]>([])
  const [searchParams, setSearchParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fadeClass, setFadeClass] = useState("fade-in")

  const sortParam = searchParams.get("sort") as SortOrder
  const emojiParam = searchParams.get("emoji")
  const [sortOrder, setSortOrder] = useState<SortOrder>(
    "asc"
    // sortParam === "asc" ? "asc" : "desc"
  )
  const [emojiFilter, setEmojiFilter] = useState<string | null>(
    emojiParam || null
  )
  const [availableCountries, setAvailableCountries] = useState<string[]>([])

  const { year } = useParams()
  const filterYear = year ? parseInt(year, 10) : undefined

  const entriesPerPage = 5
  const pageParam = parseInt(searchParams.get("page") || "1", 10)
  const [currentPage, setCurrentPage] = useState(pageParam)

  const handlePageChange = (page: number) => {
    setFadeClass("fade-out")
    setTimeout(() => {
      setCurrentPage(page)
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev)
        newParams.set("page", page.toString())
        return newParams
      })
      setFadeClass("fade-in")
    }, 200)
  }

  const toggleSortOrder = () => {
    const newOrder = sortOrder === "desc" ? "asc" : "desc"
    setSortOrder(newOrder)
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev)
      newParams.set("sort", newOrder)
      return newParams
    })
  }

  const handleFilterChange = (emoji: string) => {
    const emojiValue = emoji === "all" ? null : emoji
    setEmojiFilter(emojiValue)
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev)
      if (emojiValue) {
        newParams.set("emoji", emojiValue)
      } else {
        newParams.delete("emoji")
      }
      return newParams
    })
  }

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true)
      try {
        const snapshot = await getDocs(
          query(collection(db, "blogs"), orderBy("date", sortOrder))
        )

        const blogData = snapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            title: data.title,
            summary: data.summary,
            content: data.content,
            countryEmoji: data.countryEmoji,
            year: data.year,
            date: data.date,
          }
        }) as BlogPost[]

        const filteredByYear = filterYear
          ? blogData.filter((post) => post.year === filterYear)
          : blogData

        const uniqueCountries = Array.from(
          new Set(filteredByYear.map((post) => post.countryEmoji))
        )
        setAvailableCountries(uniqueCountries)

        const finalFiltered = filterByCountry(filteredByYear, emojiFilter)

        setRawPosts(finalFiltered)
      } catch (error) {
        console.error("Error fetching blog posts:", error)
        setError("Failed fetching blog posts 😢")
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [year, sortOrder, emojiFilter])

  useEffect(() => {
    const pageFromURL = parseInt(searchParams.get("page") || "1", 10)
    setCurrentPage((prevPage) =>
      pageFromURL !== prevPage ? pageFromURL : prevPage
    )

    const sortFromURL = searchParams.get("sort") as SortOrder
    if (sortFromURL && sortFromURL !== sortOrder) {
      setSortOrder(sortFromURL)
    }

    const emojiFromURL = searchParams.get("emoji")
    if (emojiFromURL !== emojiFilter) {
      setEmojiFilter(emojiFromURL || null)
    }
  }, [searchParams])

  const indexOfLastPost = currentPage * entriesPerPage
  const indexOfFirstPost = indexOfLastPost - entriesPerPage
  const currentPosts = rawPosts.slice(indexOfFirstPost, indexOfLastPost)
  const totalPages = Math.ceil(rawPosts.length / entriesPerPage)

  return (
    <section className="section">
      <div className="container">
        <div className="toggle-container">
          <h2>Archives</h2>
          <div>
            <Sort sortOrder={sortOrder} onToggle={toggleSortOrder} />
            <Filter
              selected={emojiFilter}
              onChange={handleFilterChange}
              countries={availableCountries}
            />
          </div>
        </div>

        {loading ? (
          <div className="preloader-content">
            <img src={icon4} className="loading-icon" alt="Loading..." />
          </div>
        ) : error ? (
          <p className="error-text">{error}</p>
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
