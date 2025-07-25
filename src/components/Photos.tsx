import { useEffect, useState, useRef } from "react"
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"
import { getGalleryImages } from "../utils/getGalleryImages"
import "../assets/css/Photos.css"
import icon4 from "../assets/icons/Icon_4.png"

const YEARS = [2018, 2019, 2022, 2023, 2024]

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5)
}

const Photos = () => {
  const [images, setImages] = useState<string[]>([])
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [selectedYear, setSelectedYear] = useState<number | "all">("all")
  const [showFilters, setShowFilters] = useState(false)
  const filterContainerRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const yearsToFetch = selectedYear === "all" ? YEARS : [selectedYear]
    getGalleryImages(yearsToFetch, 100)
      .then((fetchedImages) => setImages(shuffleArray(fetchedImages)))
      .finally(() => setLoading(false))
  }, [selectedYear])

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
            {YEARS.map((year) => (
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
              className="masonry-photo"
              loading="lazy"
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
