// Define all valid reaction types as a union type
export type ReactionType = "like" | "love" | "haha" | "wow" | "sad" | "angry"

// List of all valid reaction options
export const reactionOptions: ReactionType[] = [
  "like",
  "love",
  "haha",
  "wow",
  "sad",
  "angry",
]

// Maps each reaction to its emoji
export const emojiMap: Record<ReactionType, string> = {
  like: "👍",
  love: "❤️",
  haha: "😂",
  wow: "😮",
  sad: "😢",
  angry: "😡",
}

// Maps each reaction to a readable label (for tooltip, alt text, etc.)
export const reactionLabels: Record<ReactionType, string> = {
  like: "Like",
  love: "Love",
  haha: "Haha",
  wow: "Wow",
  sad: "Sad",
  angry: "Angry",
}

// Utility to get emoji by reaction type
export const getEmoji = (reaction: ReactionType): string => emojiMap[reaction]

// Utility to get label by reaction type
export const getLabel = (reaction: ReactionType): string =>
  reactionLabels[reaction]
