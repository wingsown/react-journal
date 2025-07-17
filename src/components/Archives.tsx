import React, { useEffect, useState } from "react"
import Folder from "./Folder"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "../firebase"
import { BlogPost } from "../types/blogData"
import { groupByYear } from "../utils/groupByYear"
import "../assets/css/List.css"

const Archives: React.FC = () => {
  const [groupedPosts, setGroupedPosts] = useState<Record<string, BlogPost[]>>(
    {}
  )

  useEffect(() => {
    const fetchPosts = async () => {
      const q = query(collection(db, "blogs"), orderBy("year", "desc"))
      const snapshot = await getDocs(q)
      const posts: BlogPost[] = snapshot.docs.map(
        (doc) => doc.data() as BlogPost
      )
      console.log("Fetched posts:", posts)

      const grouped = groupByYear(posts)
      console.log("Grouped posts:", grouped)
      setGroupedPosts(grouped)
    }

    fetchPosts()
  }, [])

  return (
    <section className="section">
      <div className="container">
        <h2>Archives</h2>
        <div className="folder-grid">
          {Object.entries(groupedPosts).map(([year, posts]) => (
            <Folder key={year} year={year} posts={posts} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Archives
