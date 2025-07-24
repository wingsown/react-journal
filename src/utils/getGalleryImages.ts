const IMAGEKIT_BASE_URL = "https://ik.imagekit.io/wilsonbuena"

const extensions = ["jpg", "jpeg", "png", "JPG", "JPEG", "PNG"]

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
      return url
    } catch {
      continue
    }
  }
  return null
}

export const getGalleryImages = async (
  years: number[],
  maxPerFolder = 50
): Promise<string[]> => {
  const allImages: string[] = []

  for (const year of years) {
    const folder = `${year}/Photos`
    const folderPath = `${IMAGEKIT_BASE_URL}/${folder}`

    const imagePromises = Array.from({ length: maxPerFolder }, (_, i) =>
      checkExistence(folderPath, `image_${i + 1}`)
    )

    const results = await Promise.all(imagePromises)
    const validImages = results.filter((url): url is string => Boolean(url))
    allImages.push(...validImages)
  }

  return allImages
}
