import React, { useEffect, useState } from "react"
import Folder from "./Folder"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "../firebase"
import { BlogPost } from "../types/blogData"
import { groupByCountry } from "../utils/groupByCountry"
import "../assets/css/List.css"
import icon4 from "../assets/icons/Icon_4.png"
import Blogs from "./Blogs"
import { useLocation, useSearchParams, useNavigate } from "react-router-dom"
import Sort from "./Sort"
import Filter from "./Filter"
import { SortOrder } from "../utils/sortUtil"
import { filterByCountry } from "../utils/filterUtil"

const Country: React.FC = () => {
  const [groupedPosts, setGroupedPosts] = useState<Record<string, BlogPost[]>>(
    {}
  )

  const [clickedCountry, setClickedCountry] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [flatPosts, setFlatPosts] = useState<BlogPost[]>([])
  const [rawPosts, setRawPosts] = useState<BlogPost[]>([])
  const [availableCountries, setAvailableCountries] = useState<string[]>([])
  const [emojiFilter, setEmojiFilter] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [fadeClass, setFadeClass] = useState("fade-in")

  const [searchParams, setSearchParams] = useSearchParams()
  const pageParam = parseInt(searchParams.get("page") || "1", 10)
  const sortParam = (searchParams.get("sort") as SortOrder) || "desc"
  const emojiParam = searchParams.get("emoji")

  const [sortOrder, setSortOrder] = useState<SortOrder>(sortParam)
  const location = useLocation()
  const navigate = useNavigate()
  const [view, setView] = useState<"folder" | "list">(() =>
    location.state?.view === "list" ? "list" : "folder"
  )

  const entriesPerPage = 5

  const handleFolderClick = (country: string) => {
  setClickedCountry(country)
}

  const toggleSortOrder = () => {
    const newOrder = sortOrder === "desc" ? "asc" : "desc"
    setSortOrder(newOrder)

    const newParams = new URLSearchParams(searchParams)
    newParams.set("sort", newOrder)
    newParams.set("page", "1")
    setSearchParams(newParams)
    setCurrentPage(1)
  }

  const handleFilterChange = (emoji: string) => {
    const emojiValue = emoji === "all" ? null : emoji
    setEmojiFilter(emojiValue)
    const newParams = new URLSearchParams(searchParams)
    if (emojiValue) {
      newParams.set("emoji", emojiValue)
    } else {
      newParams.delete("emoji")
    }
    setSearchParams(newParams)
  }

  useEffect(() => {
    if (location.state?.view === "list") {
      setView("list")
    }
  }, [location.state])

  useEffect(() => {
    const fetchFlatPosts = async () => {
      const q = query(collection(db, "blogs"), orderBy("date", sortOrder))
      const snapshot = await getDocs(q)
      const posts: BlogPost[] = snapshot.docs.map((doc) => ({
        ...(doc.data() as BlogPost),
        id: doc.id,
      }))

      const uniqueCountries = Array.from(
        new Set(posts.map((post) => post.countryEmoji))
      )
      setAvailableCountries(uniqueCountries)

      const filteredPosts = filterByCountry(posts, emojiFilter)

      setFlatPosts(filteredPosts)
      setRawPosts(posts)
      setLoading(false)
    }

    if (view === "list") {
      setLoading(true)
      fetchFlatPosts()
    }
  }, [view, sortOrder, emojiFilter])

  useEffect(() => {
    const fetchPosts = async () => {
      const q = query(collection(db, "blogs"), orderBy("country", "asc"))
      const snapshot = await getDocs(q)
      const posts: BlogPost[] = snapshot.docs.map(
        (doc) => doc.data() as BlogPost
      )
      const grouped = groupByCountry(posts)
      setGroupedPosts(grouped)
      setTimeout(() => setLoading(false), 300)
    }
    if (view === "folder") {
      fetchPosts()
    }
  }, [view])

  useEffect(() => {
    setCurrentPage(pageParam)
    setSortOrder(sortParam)
    setEmojiFilter(emojiParam || null)
  }, [pageParam, sortParam, emojiParam])

  if (loading) {
    return (
      <section className="section" id="home-loader">
        <div className="preloader-content">
          <img src={icon4} className="loading-icon" alt="Loading..." />
        </div>
      </section>
    )
  }

  return (
    <section className="section">
      <div className="container">
        <div className="toggle-container">
          <h2>Archives</h2>
          <div className="view-toggle">
            {view === "folder" && (
                <i
                  className="uil uil-archive pinButton"
                  title="View by year"
                  onClick={() => navigate("/archives")}
                />
            )}
            {view === "list" && (
              <>
                <Sort sortOrder={sortOrder} onToggle={toggleSortOrder} />
                <Filter
                  selected={emojiFilter}
                  onChange={handleFilterChange}
                  countries={availableCountries}
                />
              </>
            )}
            <span key={view} className="toggle-icon">
              {view === "folder" ? (
                <i
                  className="uil uil-list-ul"
                  onClick={() => setView("list")}
                  title="Switch to List View"
                ></i>
              ) : (
                <i
                  className="uil uil-folder"
                  onClick={() => setView("folder")}
                  title="Switch to Folder View"
                ></i>
              )}
            </span>
          </div>
        </div>

        {view === "folder" ? (
          <div className="folder-grid">
            {Object.entries(groupedPosts)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([country, posts], index) => (
                <Folder
                  key={country}
                  label={country}
                  posts={posts}
                  clickedLabel={clickedCountry}
                  onClickLabel={handleFolderClick}
                  type="country"
                  className="folder-appear"
                  style={{ animationDelay: `${index * 0.1}s` }}
                />
              ))}
          </div>
        ) : (
          <Blogs
            blogPosts={flatPosts.slice(
              (currentPage - 1) * entriesPerPage,
              currentPage * entriesPerPage
            )}
            currentPage={currentPage}
            totalPages={Math.ceil(flatPosts.length / entriesPerPage)}
            handlePageChange={(page) => {
              setFadeClass("fade-out")
              setTimeout(() => {
                setCurrentPage(page)
                const newParams = new URLSearchParams(searchParams)
                newParams.set("page", page.toString())
                setSearchParams(newParams)
                setFadeClass("fade-in")
              }, 200)
            }}
            fadeClass={fadeClass}
            showPagination={true}
          />
        )}
      </div>
    </section>
  )
}

export default Country
