import { BlogPost } from "../types/blogData"

export const groupByCountry = (posts: BlogPost[]) => {
  return posts.reduce((groups: Record<string, BlogPost[]>, post) => {
    // const year = String(post.year ?? "Unknown") // convert number to string
    const country = post.country ?? "Unknown"
    if (!groups[country]) groups[country] = []
    groups[country].push(post)

    return groups
  }, {})
}
