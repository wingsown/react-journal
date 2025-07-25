import { useEffect, useState, useRef } from "react"
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"
import { getGalleryImages } from "../utils/getGalleryImages"
import "../assets/css/Photos.css"
import icon4 from "../assets/icons/Icon_4.png"

const ALL_YEARS = [2018, 2019, 2022, 2023, 2024]
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

  useEffect(() => {
    const sourceYears =
      selectedYear === "all"
        ? filmMode
          ? FILM_YEARS
          : ALL_YEARS
        : [selectedYear]

    setLoading(true)
    getGalleryImages(sourceYears, 160, filmMode ? "Film" : "Photos")
      .then((fetchedImages) => setImages(shuffleArray(fetchedImages)))
      .finally(() => setLoading(false))
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

  return (
    <section className="photos-section">
      <div ref={filterContainerRef}>
        <div
          className="filter-icon"
          onClick={() => setShowFilters(!showFilters)}
        >
          <i className="uil uil-filter"></i>
        </div>

        {showFilters && (
          <div className="filter-dropdown">
            <button
              onClick={() => setSelectedYear("all")}
              className={`filter-button ${
                selectedYear === "all" ? "active" : ""
              }`}
            >
              All
            </button>
            {yearList.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`filter-button ${
                  selectedYear === year ? "active" : ""
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        )}

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
        <div className="masonry-gallery">
          {images.map((img, index) => (
            <img
              key={img}
              src={img}
              alt={`Photo ${index + 1}`}
              className={`masonry-photo ${
                loadedImages.has(img) ? "loaded" : "loading"
              }`}
              loading="lazy"
              onLoad={() => setLoadedImages((prev) => new Set(prev).add(img))}
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
