import { BlogPost } from "../types/blogData"

export const groupByRegion = (posts: BlogPost[]) => {
    return posts.reduce((acc, post) => {
        const key = post.region.normalize("NFC").trim()
        acc[key] = acc[key] || []
        acc[key].push(post)
        return acc
    }, {} as Record<string, BlogPost[]>)
}