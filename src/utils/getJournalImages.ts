const IMAGEKIT_BASE_URL = "https://ik.imagekit.io/wilsonbuena"

export const getJournalImages = async (
  folder: string,
  maxCount: number
): Promise<string[]> => {
  const basePath = `${IMAGEKIT_BASE_URL}/${folder}`

  const extensions = ["png", "webp", "jpg", "jpeg", "PNG", "JPG", "JPEG"]

  const checkExistence = (index: number): Promise<string | null> =>
    new Promise(async (resolve) => {
      for (const ext of extensions) {
        const url = `${basePath}/image_${index}.${ext}`

        const result = await new Promise<string | null>((res) => {
          const img = new Image()
          img.src = url
          img.onload = () => res(url)
          img.onerror = () => res(null)
        })

        if (result) {
          return resolve(result)
        }
      }

      resolve(null)
    })

  const results = await Promise.all(
    Array.from({ length: maxCount }, (_, i) => checkExistence(i + 1))
  )

  return results.filter((url): url is string => url !== null)
}

export const getInlineImagePositions = (paragraphCount: number): number[] => {
  if (paragraphCount < 3) return [0]

  if (paragraphCount > 10) {
    // For longer journals, add 5 images evenly spaced
    const spacing = paragraphCount / 6 // 6 segments for 5 images
    return [
      Math.floor(spacing * 1),
      Math.floor(spacing * 2),
      Math.floor(spacing * 3),
      Math.floor(spacing * 4),
      Math.floor(spacing * 5),
    ]
  }

  // Default: 3 images at 25%, 50%, 75%
  const spacing = paragraphCount / 4
  return [
    Math.floor(spacing * 1),
    Math.floor(spacing * 2),
    Math.floor(spacing * 3),
  ]
}
