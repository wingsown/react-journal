const IMAGEKIT_BASE_URL = "https://ik.imagekit.io/wilsonbuena"

export const getJournalImages = async (
  folder: string,
  maxCount: number
): Promise<string[]> => {
  const images: string[] = []

  for (let i = 1; i <= maxCount; i++) {
    const url = `${IMAGEKIT_BASE_URL}/${folder}/image_${i}.png`

    const exists = await new Promise<boolean>((resolve) => {
      const img = new Image()
      img.src = url

      img.onload = () => resolve(true)
      img.onerror = () => resolve(false)
    })

    if (exists) {
      images.push(url)
    }
  }

  return images
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
