export interface BlogPost {
  id: number
  title: string
  summary: string
  countryEmoji: string
  path: string
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "📍Ilocos, 2024",
    summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    countryEmoji: "🇵🇭",
    path: "/blog-post-path",
  },
  {
    id: 2,
    title: "⛰️Mt. Apo, 2023",
    summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    countryEmoji: "🇵🇭",
    path: "/blog-post-path",
  },
  {
    id: 3,
    title: "📍Taichung, 2023",
    summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    countryEmoji: "🇹🇼",
    path: "/blog-post-path",
  },
  {
    id: 4,
    title: "📍Bangkok, 2019",
    summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    countryEmoji: "🇹🇭",
    path: "/blog-post-path",
  },
  {
    id: 5,
    title: "📍Taipei, 2019",
    summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    countryEmoji: "🇹🇼",
    path: "/blog-post-path",
  },
]
