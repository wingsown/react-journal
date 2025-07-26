import { useEffect, useState, useRef } from "react"
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"
import { getGalleryImages } from "../utils/getGalleryImages"
import "../assets/css/Photos.css"
import icon4 from "../assets/icons/Icon_4.png"

const ALL_YEARS = [2024, 2023, 2022, 2021, 2020, 2019, 2018]
const FILM_YEARS = [2023] // Update based on actual folder availability

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5)
}

const Photos = () => {
  const [images, setImages] = useState<string[]>([])
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [selectedYear, setSelectedYear] = useState<number | "all">("all")
  const [showFilters, setShowFilters] = useState(false)
  const [filmMode, setFilmMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const filterContainerRef = useRef<HTMLDivElement>(null)
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const [totalImages, setTotalImages] = useState(0)

  useEffect(() => {
    const sourceYears =
      selectedYear === "all"
        ? filmMode
          ? FILM_YEARS
          : ALL_YEARS
        : [selectedYear]

    setLoading(true)
    setLoadedImages(new Set()) // Reset loaded images
    getGalleryImages(sourceYears, 100, filmMode ? "Film" : "Photos").then(
      (fetchedImages) => {
        const shuffled = shuffleArray(fetchedImages)
        setImages(shuffled)
        setTotalImages(shuffled.length)
        // Edge case: if no images, set loading false immediately
        if (shuffled.length === 0) {
          setLoading(false)
        }
      }
    )
  }, [selectedYear, filmMode])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        filterContainerRef.current &&
        !filterContainerRef.current.contains(e.target as Node)
      ) {
        setShowFilters(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const yearList = filmMode ? FILM_YEARS : ALL_YEARS

  useEffect(() => {
    if (loading) {
      const timeout = setTimeout(() => setLoading(false), 9000)
      return () => clearTimeout(timeout)
    }
  }, [loading])

  return (
    <section className="photos-section">
      <div ref={filterContainerRef}>
        <div
          className={`filter-container ${showFilters ? "open" : ""}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <div className="filter-icon">
            <i className="uil uil-filter"></i>
          </div>

          <div className={`filter-dropdown ${showFilters ? "visible" : ""}`}>
            <div
              onClick={(e) => {
                e.stopPropagation()
                setSelectedYear("all")
                setShowFilters(false)
              }}
              className={`filter-item ${
                selectedYear === "all" ? "active" : ""
              }`}
            >
              All
            </div>
            {yearList.map((year) => (
              <div
                key={year}
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedYear(year)
                  setShowFilters(false)
                }}
                className={`filter-item ${
                  selectedYear === year ? "active" : ""
                }`}
              >
                {year}
              </div>
            ))}
          </div>
        </div>

        <div
          onClick={() => setFilmMode((prev) => !prev)}
          className={`film-toggle-icon ${filmMode ? "active" : ""}`}
        >
          {filmMode ? "📷" : "🎞️"}
        </div>
      </div>

      {loading ? (
        <div className="preloader-content">
          <img src={icon4} className="loading-icon" alt="Loading..." />
        </div>
      ) : (
        <div className={`masonry-gallery ${!loading ? "gallery-loaded" : ""}`}>
          {images.map((img, index) => (
            <img
              key={img}
              src={img}
              alt={`Photo ${index + 1}`}
              className={`masonry-photo ${
                loadedImages.has(img) ? "loaded" : "loading"
              } ${filmMode ? "film-frame" : ""}`}
              loading="lazy"
              onLoad={() => {
                setLoadedImages((prev) => {
                  const updated = new Set(prev).add(img)
                  if (updated.size === totalImages) {
                    setLoading(false)
                  }
                  return updated
                })
              }}
              onError={() => {
                setImages((prev) => prev.filter((i) => i !== img))
              }}
              onClick={() => {
                setLightboxIndex(index)
                setLightboxOpen(true)
              }}
            />
          ))}
        </div>
      )}

      {lightboxOpen && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={images.map((src) => ({ src }))}
          index={lightboxIndex}
          on={{ view: ({ index }) => setLightboxIndex(index) }}
        />
      )}
    </section>
  )
}

export default Photos
