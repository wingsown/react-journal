import React from "react"
import "../assets/css/Sort.css"

type SortOrder = "asc" | "desc"

interface SortToggleProps {
  sortOrder: SortOrder
  onToggle: () => void
}

const Sort: React.FC<SortToggleProps> = ({ sortOrder, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="sort-toggle-btn"
      title="Arranged by date"
    >
      {sortOrder === "desc" ? (
        <i className="uil uil-sort-amount-down"></i>
      ) : (
        <i className="uil uil-sort-amount-up"></i>
      )}
    </button>
  )
}

export default Sort
