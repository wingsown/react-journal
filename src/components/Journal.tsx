import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { BlogPost } from "../types/blogData"
import "../assets/css/Journal.css"
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"

import {
  getJournalImages,
  getInlineImagePositions,
} from "../utils/getJournalImages"

import icon4 from "../assets/icons/Icon_4.png"

import { doc, getDoc } from "firebase/firestore"
import { db } from "../firebase"

const Journal = () => {
  const { id } = useParams()
  const [post, setPost] = useState<BlogPost | null>(null)
  const navigate = useNavigate()
  const [error, setError] = useState(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

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
            date: data.date,
            slug: data.slug,
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

  const generateHash = (str: string): string => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i)
      hash |= 0
    }
    return hash.toString()
  }

  if (!post && !error) {
    return (
      <div id="journal-loader" className="section">
        <div className="preloader-content">
          <img src={icon4} className="loading-icon" />
        </div>
      </div>
    )
  }

  const paragraphs = post.content.replace(/\\n/g, "\n").split("\n\n")
  const folder = `${post.year}/${post.slug}`
  const maxImages = 15

  const fallbackFolder = `${post.year}/${post.slug
    .toLowerCase()
    .replace(/\s+/g, "-")}`

  const images = getJournalImages(
    post.slug ? folder : fallbackFolder,
    maxImages
  )

  const inlinePositions = getInlineImagePositions(paragraphs.length)

  return (
    <div className="section">
      <article className="journal-entry">
        <h2>{post.title}</h2>

        <div className="journal-content">
          {paragraphs.map((para, idx) => {
            const imageIndex = inlinePositions.indexOf(idx)
            return (
              <div key={generateHash(para)}>
                <p>{para}</p>

                {imageIndex !== -1 && images[imageIndex] && (
                  <img
                    src={images[imageIndex]}
                    alt={`Inline image after paragraph ${idx + 1}`}
                    className="journal-image"
                    loading="lazy"
                    onClick={() => {
                      setLightboxIndex(imageIndex)
                      setLightboxOpen(true)
                    }}
                    style={{ cursor: "pointer" }}
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* 🖼 Masonry-style gallery */}
        {images.length > inlinePositions.length && (
          <div className="masonry-gallery">
            {images.slice(inlinePositions.length).map((img, i) => {
              const realIndex = i + inlinePositions.length
              return (
                <img
                  key={`gallery-${i}`}
                  src={img}
                  alt={`Gallery image ${i + 1}`}
                  className="masonry-photo"
                  loading="lazy"
                  onClick={() => {
                    setLightboxIndex(realIndex)
                    setLightboxOpen(true)
                  }}
                  style={{ cursor: "pointer" }}
                />
              )
            })}
          </div>
        )}

        <button
          onClick={() => navigate(`/archives/${post.year}`)}
          className="back-button"
        >
          ← Back
        </button>
      </article>

      {lightboxOpen && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={images.map((src) => ({ src }))}
          index={lightboxIndex}
          on={{
            view: ({ index }) => setLightboxIndex(index),
          }}
        />
      )}
    </div>
  )
}

export default Journal
