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
