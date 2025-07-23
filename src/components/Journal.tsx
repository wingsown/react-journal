import { useParams, useNavigate, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import { BlogPost } from "../types/blogData"
import "../assets/css/Journal.css"
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"

import {
  getJournalImages,
  getInlineImagePositions,
} from "../utils/getJournalImages"
import { reactionOptions, ReactionType } from "../utils/reactions"
import ReactionBar from "./ReactionBar"
import icon4 from "../assets/icons/Icon_4.png"

import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore"
import { db } from "../firebase"

const Journal = () => {
  const { id } = useParams()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [error, setError] = useState(null)
  const [images, setImages] = useState<string[]>([])
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [reactionCounts, setReactionCounts] = useState<
    Partial<Record<ReactionType, number>>
  >({})
  const [userReaction, setUserReaction] = useState<ReactionType | undefined>()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || "/archives"

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return
      try {
        const docRef = doc(db, "blogs", id)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          const data = docSnap.data()
          const blogData: BlogPost = {
            id: docSnap.id,
            title: data.title,
            summary: data.summary,
            content: data.content,
            countryEmoji: data.countryEmoji,
            year: data.year,
            date: data.date,
            slug: data.slug,
          }
          setPost(blogData)

          const folder = `${data.year}/${data.slug}`
          const validImages = await getJournalImages(folder, 50)
          setImages(validImages)

          // Load reactions
          const reactionDoc = await getDoc(doc(db, "reactions", id))
          if (reactionDoc.exists()) {
            const data = reactionDoc.data()
            setReactionCounts(data.reactions || {})
          }

          // Load user reaction from localStorage
          const localReaction = localStorage.getItem(
            `reaction-${id}`
          ) as ReactionType | null
          if (localReaction && reactionOptions.includes(localReaction)) {
            setUserReaction(localReaction)
          }
        } else {
          setPost(null)
          setError("Post not found")
        }
      } catch (error) {
        console.error("Error fetching post:", error)
        setPost(null)
        setError("Failed fetching post 😢")
      }
    }

    fetchBlog()
  }, [id])

  useEffect(() => {
    if (!id) return

    const fetchReactions = async () => {
      try {
        const reactionRef = doc(db, "reactions", id)
        const docSnap = await getDoc(reactionRef)
        if (docSnap.exists()) {
          setReactionCounts(docSnap.data().reactions || {})
        }
      } catch (err) {
        console.error("Failed to fetch reactions:", err)
      }
    }

    fetchReactions()
    setUserReaction(
      localStorage.getItem(`reaction-${id}`) as ReactionType | null
    )
  }, [id])

  const handleReact = async (reaction: ReactionType) => {
    if (!id) return

    const previousReaction = localStorage.getItem(
      `reaction-${id}`
    ) as ReactionType | null
    const isSameReaction = previousReaction === reaction

    const reactionRef = doc(db, "reactions", id)

    try {
      const reactionDoc = await getDoc(reactionRef)

      const currentData = reactionDoc.exists()
        ? reactionDoc.data()
        : {
            reactions: {},
          }

      const currentCounts = currentData.reactions || {}

      const updates: Record<string, any> = {}

      if (isSameReaction) {
        // User is removing their reaction
        updates[`reactions.${reaction}`] = Math.max(
          (currentCounts[reaction] || 1) - 1,
          0
        )
        localStorage.removeItem(`reaction-${id}`)
        setUserReaction(null)

        setReactionCounts((prev) => ({
          ...prev,
          [reaction]: Math.max((prev[reaction] || 1) - 1, 0),
        }))
      } else {
        // User is changing or adding a reaction
        if (previousReaction) {
          // Decrease old reaction
          updates[`reactions.${previousReaction}`] = Math.max(
            (currentCounts[previousReaction] || 1) - 1,
            0
          )
        }

        // Increase new reaction
        updates[`reactions.${reaction}`] = (currentCounts[reaction] || 0) + 1

        localStorage.setItem(`reaction-${id}`, reaction)
        setUserReaction(reaction)

        setReactionCounts((prev) => ({
          ...prev,
          [previousReaction ?? ""]: previousReaction
            ? Math.max((prev[previousReaction] || 1) - 1, 0)
            : undefined,
          [reaction]: (prev[reaction] || 0) + 1,
        }))
      }

      if (reactionDoc.exists()) {
        await updateDoc(reactionRef, updates)
      } else {
        await setDoc(reactionRef, { reactions: { [reaction]: 1 } })
      }
    } catch (err) {
      console.error("Error reacting:", err)
    }
  }

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

  if (error) {
    return <div className="section error">{error}</div>
  }

  const paragraphs = post.content.replace(/\\n/g, "\n").split("\n\n")
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

        <div className="archives-button-wrapper left">
          <button onClick={() => navigate(from)} className="back-button">
            Back
          </button>
        </div>
      </article>

      <div className="reaction-bottom-wrapper">
        <ReactionBar
          postId={post.id}
          userReaction={userReaction}
          setUserReaction={setUserReaction}
          reactionCounts={reactionCounts}
          setReactionCounts={setReactionCounts}
          handleReact={handleReact}
        />
      </div>

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
