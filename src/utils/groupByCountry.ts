import { BlogPost } from "../types/blogData"

export const groupByCountry = (posts: BlogPost[]) => {
  return posts.reduce((acc, post) => {
    const key = post.country.normalize("NFC").trim()
    acc[key] = acc[key] || []
    acc[key].push(post)
    return acc
  }, {} as Record<string, BlogPost[]>)
}

