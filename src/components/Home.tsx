import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import "../index.css"
import "../assets/css/List.css"
import { BlogPost } from "../types/blogData"
import icon4 from "../assets/icons/Icon_4.png"

import {
    collection,
    getDocs,
    query,
    orderBy,
    limit,
    where,
} from "firebase/firestore"
import { db } from "../firebase"

const Home: React.FC = () => {
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
    const [fadeClass, setFadeClass] = useState("fade-in")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchBlogs = async () => {
             console.log("Firestore project:", db.app.options.projectId)
            try {
                const blogQuery = query(
                    collection(db, "blogs"),
                    where("travel", "==", true),
                    orderBy("date", "desc"),
                    limit(5) // ✅ only get latest 5 posts
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
                        slug: data.slug,
                        date: data.date,
                        travel: data.travel,
                    }
                }) as BlogPost[]
                setBlogPosts(blogData)
            } catch (error) {
                console.error("Error fetching blog posts:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchBlogs()
    }, [])

    if (loading) {
        return (
            <section className="section" id="home-loader">
                <div className="preloader-content">
                    <img
                        src={icon4}
                        className="loading-icon"
                        alt="Loading..."
                    />
                </div>
            </section>
        )
    }

    return (
        <section className="section">
            <div className="blog-list container">
                <h2>Latest</h2>

                <div className={`blog-entries ${fadeClass}`}>
                    {blogPosts.map((blog) => (
                        <div className="blog-preview" key={blog.id}>
                            <Link
                                to={`blogs/${blog.id}`}
                                state={{
                                    from: "/",
                                    view: "home",
                                }}
                            >
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
                <div className="archives-button-wrapper right">
                    <Link to="/archives" className="archives-button">
                        View Archives <span className="arrow-icon">→</span>
                    </Link>
                </div>
                <div className="archives-button-wrapper right">
                    <Link to="/country" className="archives-button">
                        Country <span className="arrow-icon">→</span>
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default Home
