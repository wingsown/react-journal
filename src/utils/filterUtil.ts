export const filterByCountry = (posts: any[], emoji: string | null): any[] => {
  if (!emoji || emoji === "all") return posts
  return posts.filter((post) => post.countryEmoji === emoji)
}
