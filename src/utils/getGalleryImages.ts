const IMAGEKIT_BASE_URL = "https://ik.imagekit.io/wilsonbuena"

const extensions = ["jpg", "jpeg", "png", "JPG", "JPEG", "PNG"]

// Helper to check if an image file exists for a given name and extension
const checkExistence = async (
  basePath: string,
  baseName: string
): Promise<string | null> => {
  for (const ext of extensions) {
    const url = `${basePath}/${baseName}.${ext}`
    try {
      await new Promise<void>((resolve, reject) => {
        const img = new Image()
        img.src = url
        img.onload = () => resolve()
        img.onerror = () => reject()
      })
      return url // Return valid URL
    } catch {
      continue
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
  const allValidImages: string[] = []

  if (years.length === 1) {
    // Single folder case
    const year = years[0]
    const folder = `${year}/${albumType}`
    const folderPath = `${IMAGEKIT_BASE_URL}/${folder}`

    const imagePromises = Array.from({ length: 100 }, (_, i) =>
      checkExistence(folderPath, `image_${i + 1}`)
    )

    const results = await Promise.all(imagePromises)
    return results.filter((url): url is string => Boolean(url))
  }

  // Multiple folders — collect from all then shuffle and slice
  for (const year of years) {
    const folder = `${year}/${albumType}`
    const folderPath = `${IMAGEKIT_BASE_URL}/${folder}`

    const imagePromises = Array.from({ length: 50 }, (_, i) =>
      checkExistence(folderPath, `image_${i + 1}`)
    )

    const results = await Promise.all(imagePromises)
    const valid = results.filter((url): url is string => Boolean(url))
    allValidImages.push(...valid)
  }

  // Shuffle and limit total
  return shuffleArray(allValidImages).slice(0, maxTotal)
}

/**
 * Utility to detect which years have "Film" albums
 * Used to display year filters for film mode
 */
export const getFilmYears = async (years: number[]): Promise<number[]> => {
  const hasFilm = await Promise.all(
    years.map(async (year) => {
      const url = `${IMAGEKIT_BASE_URL}/${year}/Film/image_1.jpg`
      try {
        await new Promise<void>((resolve, reject) => {
          const img = new Image()
          img.src = url
          img.onload = () => resolve()
          img.onerror = () => reject()
        })
        return true
      } catch {
        return false
      }
    })
  )

  return years.filter((_, idx) => hasFilm[idx])
}

const shuffleArray = <T>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5)
}
