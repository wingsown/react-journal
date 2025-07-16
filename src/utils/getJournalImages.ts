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
  if (paragraphCount < 3) return [0] // fallback: just add one image

  const spacing = paragraphCount / 4 // divide into 4 parts, insert at 1/4, 2/4, 3/4
  return [
    Math.floor(spacing), // 25%
    Math.floor(spacing * 2), // 50%
    Math.floor(spacing * 3), // 75%
  ]
}
