import React from "react"
import "../assets/css/Sort.css"

type SortOrder = "asc" | "desc"

interface SortToggleProps {
  sortOrder: SortOrder
  onToggle: () => void
}

const SortToggle: React.FC<SortToggleProps> = ({ sortOrder, onToggle }) => {
  return (
    <button onClick={onToggle} className="sort-toggle-btn">
      {sortOrder === "desc" ? (
        <i className="uil uil-sort-amount-down"></i>
      ) : (
        <i className="uil uil-sort-amount-up"></i>
      )}
    </button>
  )
}

export default SortToggle
