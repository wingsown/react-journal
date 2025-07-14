import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { BlogPost, blogPosts as fallbackPosts } from "../data/blogData"
import "../css/Journal.css"
const Journal = () => {
  const { id } = useParams()
  const [post, setPost] = useState<BlogPost | null>(null)

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`http://localhost:3000/blogs/${id}`)
        if (!res.ok) throw new Error("Failed to fetch")
        const data = await res.json()
        setPost(data)
      } catch (err) {
        console.warn("Using fallback post", err)
        const fallback = fallbackPosts.find((p) => String(p.id) === id)
        setPost(fallback || null)
      }
    }

    fetchBlog()
  }, [id])

  if (!post) return <div>Loading...</div>
  return (
    <div className="section">
      <article className="journal-entry">
        <h2>{post.title}</h2>
        <div>{post.summary}</div>
      </article>
    </div>
  )
}

export default Journal
