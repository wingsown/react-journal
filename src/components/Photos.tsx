import { useEffect, useState, useRef } from "react"
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"
import { getGalleryImages } from "../utils/getGalleryImages"
import "../assets/css/Photos.css"

const YEARS = [2018, 2019, 2022, 2023]

const Photos = () => {
  const [images, setImages] = useState<string[]>([])
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [selectedYear, setSelectedYear] = useState<number | "all">("all")
  const [showFilters, setShowFilters] = useState(false)
  const filterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const yearsToFetch = selectedYear === "all" ? YEARS : [selectedYear]
    getGalleryImages(yearsToFetch, 150).then(setImages)
  }, [selectedYear])

  // Close the filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setShowFilters(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <section className="photos-section">
      <div className="filter-icon" onClick={() => setShowFilters(!showFilters)}>
        <i className="uil uil-filter"></i>
      </div>

      {showFilters && (
        <div className="filter-dropdown" ref={filterRef}>
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

      <div className="masonry-gallery">
        {images.length === 0 ? (
          <div className="under-construction">
            🚧 This page is under construction. Please check back later!
          </div>
        ) : (
          images.map((img, index) => (
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
          ))
        )}
      </div>

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
