import { BlogPost } from "../types/blogData"

export const groupByYear = (posts: BlogPost[]) => {
  return posts.reduce((groups: Record<string, BlogPost[]>, post) => {
    const year = String(post.year ?? "Unknown") // convert number to string
    if (!groups[year]) groups[year] = []
    groups[year].push(post)

    return groups
  }, {})
}
