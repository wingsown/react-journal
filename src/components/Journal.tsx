import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { BlogPost } from "../types/blogData"
import "../css/Journal.css"

import { doc, getDoc } from "firebase/firestore"
import { db } from "../firebase"

const Journal = () => {
  const { id } = useParams()
  const [post, setPost] = useState<BlogPost | null>(null)
  const navigate = useNavigate()
  const [error, setError] = useState(null)

  // MOCK DATA
  // useEffect(() => {
  //   const fetchBlog = async () => {
  //     try {
  //       const res = await fetch(`http://localhost:3000/blogs/${id}`)
  //       if (!res.ok) throw new Error("Failed to fetch")
  //       const data = await res.json()
  //       setPost(data)
  //     } catch (err) {
  //       console.warn("Using fallback post", err)
  //       const fallback = fallbackPosts.find((p) => String(p.id) === id)
  //       setPost(fallback || null)
  //     }
  //   }

  //   fetchBlog()
  // }, [id])

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return
      try {
        const docRef = doc(db, "blogs", id)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          const data = docSnap.data()
          setPost({
            id: docSnap.id,
            title: data.title,
            summary: data.summary,
            content: data.content,
            countryEmoji: data.countryEmoji,
            year: data.year,
          })
        } else {
          console.warn("No such blog post in Firestore")
          setPost(null)
        }
      } catch (error) {
        console.error("Error fetching blog post:", error)
        setPost(null)
        setError("Failed fetching post 😢")
      }
    }

    fetchBlog()
  }, [id])

  if (!post) return <div>Loading...</div>
  return (
    <div className="section">
      <article className="journal-entry">
        <h2>{post.title}</h2>
        <div>{post.content}</div>
      </article>
      <button onClick={() => navigate(-1)} className="back-button">
        ← Back
      </button>
    </div>
  )
}

export default Journal
