import { useState } from "react"
import {
  reactionOptions,
  getEmoji,
  getLabel,
  ReactionType,
} from "../utils/reactions"
import "../assets/css/ReactionBar.css"

interface ReactionBarProps {
  postId: string
  userReaction?: ReactionType
  setUserReaction: (reaction: ReactionType) => void
  reactionCounts: Partial<Record<ReactionType, number>>
  setReactionCounts: React.Dispatch<
    React.SetStateAction<Partial<Record<ReactionType, number>>>
  >
  handleReact: (reaction: ReactionType) => void
}

const ReactionBar = ({
  userReaction,
  setUserReaction,
  reactionCounts,
  handleReact,
}: ReactionBarProps) => {
  const [showBubble, setShowBubble] = useState(false)

  console.log("reactionCounts", reactionCounts)

  const handleClickReaction = (reaction: ReactionType) => {
    if (reaction !== userReaction) {
      handleReact(reaction)
      setUserReaction(reaction)
    }
    setShowBubble(false)
  }

  const displayEmoji = userReaction ? getEmoji(userReaction) : "🙂"

  return (
    <div className="reaction-wrapper">
      <button
        className="reaction-toggle-button"
        onClick={() => setShowBubble(!showBubble)}
        title={userReaction ? getLabel(userReaction) : "React"}
      >
        {displayEmoji}
      </button>

      {showBubble && (
        <div className="reaction-bubble">
          {reactionOptions.map((reaction) => (
            <button
              key={reaction}
              className="reaction-bubble-emoji"
              onClick={() => handleClickReaction(reaction)}
              title={getLabel(reaction)}
            >
              {getEmoji(reaction)}
            </button>
          ))}
        </div>
      )}

      {Object.entries(reactionCounts).some(
        ([, count]) => count && count > 0
      ) && (
        <div className="reaction-counts-bar">
          {Object.entries(reactionCounts)
            .filter(([, count]) => count && count > 0)
            .map(([reaction, count]) => (
              <div key={reaction} className="reaction-count-item">
                {getEmoji(reaction as ReactionType)} {count}
              </div>
            ))}
        </div>
      )}
    </div>
  )
}

export default ReactionBar
