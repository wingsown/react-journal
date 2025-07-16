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

export const getInlineImagePositions = (count: number): number[] => {
  if (count <= 3) return [0]
  if (count <= 5) return [0, 2]
  if (count <= 7) return [0, 3, 5]
  return [1, 4, 7]
}
