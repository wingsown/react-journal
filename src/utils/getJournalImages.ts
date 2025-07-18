export const getJournalImages = (folder: string, count: number): string[] => {
  const images: string[] = []
  for (let i = 1; i <= count; i++) {
    try {
      const image = require(`../assets/photos/${folder}/image_${i}.png`)
      images.push(image.default || image)
    } catch (err) {
      console.warn(`Missing image: ${folder}/image_${i}.png`)
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
