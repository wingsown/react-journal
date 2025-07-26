const IMAGEKIT_BASE_URL = "https://ik.imagekit.io/wilsonbuena"

const extensions = ["webp"]

// Helper to check if an image file exists for a given name and extension using HEAD request
const checkExistence = async (
  basePath: string,
  baseName: string
): Promise<string | null> => {
  for (const ext of extensions) {
    const url = `${basePath}/${baseName}.${ext}?tr=fo-auto,q-70` // Use transformed version
    try {
      const res = await fetch(url, { method: "HEAD" })
      if (res.ok) return url
    } catch {
      // continue to next extension
    }
  }
  return null
}

/**
 * Main image loader
 * @param years Array of years to fetch from
 * @param maxTotal Max images to return (default 50)
 * @param albumType "Photos" | "Film" (folder name)
 */
export const getGalleryImages = async (
  years: number[],
  maxTotal = 50,
  albumType: "Photos" | "Film" = "Photos"
): Promise<string[]> => {
  const allImages: string[] = []

  for (const year of years) {
    const manifestUrl = `/manifests/${year}/${albumType}/manifest.json`

    try {
      const res = await fetch(manifestUrl)
      if (!res.ok) {
        console.warn(`⚠️ Manifest not found: ${manifestUrl}`)
        continue
      }

      const data: { src: string }[] = await res.json()
      const urls = data.map((img) => img.src)
      allImages.push(...urls)
    } catch (err) {
      console.error(`❌ Error loading manifest: ${manifestUrl}`, err)
    }
  }

  // Shuffle and limit
  return shuffleArray(allImages).slice(0, maxTotal)
}

/**
 * Utility to detect which years have "Film" albums
 * Used to display year filters for film mode
 */
export const getFilmYears = async (years: number[]): Promise<number[]> => {
  const checks = await Promise.all(
    years.map(async (year) => {
      const manifestUrl = `/manifests/${year}/Film/manifest.json`
      try {
        const res = await fetch(manifestUrl, { method: "HEAD" })
        return res.ok
      } catch {
        return false
      }
    })
  )

  return years.filter((_, idx) => checks[idx])
}

const shuffleArray = <T>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5)
}
