import { BlogPost } from "../types/blogData"

export type SortOrder = "asc" | "desc"

export const sortBlogPosts = (
  posts: BlogPost[],
  sortOrder: SortOrder = "desc"
): BlogPost[] => {
  return [...posts].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.year - b.year
    } else {
      return b.year - a.year
    }
  })
}
