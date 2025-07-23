import React, { useState, useEffect, useRef } from "react"
import "../assets/css/Filter.css"

type FilterProps = {
  selected: string | null
  onChange: (value: string) => void
  countries: string[]
}

const Filter: React.FC<FilterProps> = ({ selected, onChange, countries }) => {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (value: string) => {
    onChange(value)
    setOpen(false)
  }

  return (
    <div className="filter-wrapper" ref={dropdownRef}>
      <button
        className="filter-icon-button"
        onClick={() => setOpen((prev) => !prev)}
        title="Filter by Emoji"
      >
        <i className="uil uil-filter"></i>
      </button>

      {open && (
        <div className="filter-dropdown-menu">
          <div
            className={`filter-item ${selected === null ? "active" : ""}`}
            onClick={() => handleSelect("all")}
          >
            📚
          </div>
          {countries.map((emoji) => (
            <div
              key={emoji}
              className={`filter-item ${selected === emoji ? "active" : ""}`}
              onClick={() => handleSelect(emoji)}
            >
              {emoji}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Filter
