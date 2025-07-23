// Define all valid reaction types as a union type
export type ReactionType =
  | "smile"
  | "hundred"
  | "heart"
  | "haha"
  | "wow"
  | "sad"
  | "fire"

// List of all valid reaction options
export const reactionOptions: ReactionType[] = [
  "smile",
  "hundred",
  "heart",
  "haha",
  "wow",
  "sad",
  "fire",
]

// Maps each reaction to its emoji
export const emojiMap: Record<ReactionType, string> = {
  smile: "🙂",
  hundred: "💯",
  heart: "❤️",
  haha: "😂",
  wow: "😮",
  sad: "😢",
  fire: "🔥",
}

// Maps each reaction to a readable label (for tooltip, alt text, etc.)
export const reactionLabels: Record<ReactionType, string> = {
  smile: "Smile",
  hundred: "Hundred",
  heart: "Heart",
  haha: "Haha",
  wow: "Wow",
  sad: "Sad",
  fire: "Fire",
}

// Utility to get emoji by reaction type
export const getEmoji = (reaction: ReactionType): string => emojiMap[reaction]

// Utility to get label by reaction type
export const getLabel = (reaction: ReactionType): string =>
  reactionLabels[reaction]
