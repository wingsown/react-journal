// src/components/Photos.tsx

import { useEffect, useState } from "react"
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"
import { getGalleryImages } from "../utils/getGalleryImages"
import "../assets/css/Photos.css"

const Photos = () => {
  const [images, setImages] = useState<string[]>([])
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  useEffect(() => {
    const fetchPhotos = async () => {
      const years = [2018, 2019, 2022] // Add more years as needed
      const allPhotos = await getGalleryImages(years, 50)
      setImages(allPhotos)
    }

    fetchPhotos()
  }, [])

  return (
    <section className="photos-section">
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
          on={{
            view: ({ index }) => setLightboxIndex(index),
          }}
        />
      )}
    </section>
  )
}

export default Photos
