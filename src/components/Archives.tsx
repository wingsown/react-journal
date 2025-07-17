import React, { useEffect, useState } from "react"
import Folder from "./Folder"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "../firebase"
import { BlogPost } from "../types/blogData"
import { groupByYear } from "../utils/groupByYear"
import "../assets/css/List.css"
import icon4 from "../assets/icons/Icon_4.png"

const Archives: React.FC = () => {
  const [groupedPosts, setGroupedPosts] = useState<Record<string, BlogPost[]>>(
    {}
  )
  const [clickedYear, setClickedYear] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

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
        <h2>Archives</h2>
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
      </div>
    </section>
  )
}

export default Archives
