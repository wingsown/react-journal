import React, { useEffect, useState } from "react"
import Folder from "./Folder"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "../firebase"
import { BlogPost } from "../types/blogData"
import { groupByYear } from "../utils/groupByYear"
import "../assets/css/List.css"
import icon4 from "../assets/icons/Icon_4.png"
import List from "./List"
import Blogs from "./Blogs"

const Archives: React.FC = () => {
  const [groupedPosts, setGroupedPosts] = useState<Record<string, BlogPost[]>>(
    {}
  )
  const [clickedYear, setClickedYear] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<"folder" | "list">("folder")
  const [flatPosts, setFlatPosts] = useState<BlogPost[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const entriesPerPage = 5
  const [fadeClass, setFadeClass] = useState("fade-in")

  const handleFolderClick = (year: string) => {
    setClickedYear(year)
  }

  useEffect(() => {
    const fetchPosts = async () => {
      const q = query(collection(db, "blogs"), orderBy("year", "desc"))
      const snapshot = await getDocs(q)
      const posts: BlogPost[] = snapshot.docs.map(
        (doc) => doc.data() as BlogPost
      )

      const grouped = groupByYear(posts)

      setGroupedPosts(grouped)
      setTimeout(() => setLoading(false), 300)
    }

    fetchPosts()
  }, [])

  useEffect(() => {
    const fetchFlatPosts = async () => {
      const q = query(collection(db, "blogs"), orderBy("date", "desc"))
      const snapshot = await getDocs(q)
      const posts: BlogPost[] = snapshot.docs.map((doc) => ({
        ...(doc.data() as BlogPost),
        id: doc.id,
      }))
      setFlatPosts(posts)
    }

    if (view === "list" && flatPosts.length === 0) {
      fetchFlatPosts()
    }
  }, [view])

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
        <div className="test">
          <h2>Archives</h2>
          <div className="view-toggle">
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
          </div>
        </div>

        {view === "folder" ? (
          <div className="folder-grid">
            {Object.entries(groupedPosts)
              .sort(([a], [b]) => Number(b) - Number(a))
              .map(([year, posts], index) => (
                <Folder
                  key={year}
                  year={year}
                  posts={posts}
                  clickedYear={clickedYear}
                  onClick={handleFolderClick}
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

export default Archives
