import React, { useState } from "react"
import "../assets/css/Folder.css"
import { BlogPost } from "../types/blogData"
import { useNavigate } from "react-router-dom"

interface FolderProps {
  year: string
  posts: BlogPost[]
  clickedYear: string | null
  onClick: (year: string) => void
  className?: string
  style?: React.CSSProperties
}

const Folder: React.FC<FolderProps> = ({
  year,
  posts,
  clickedYear,
  onClick,
  style,
  className,
}) => {
  const [active, setActive] = useState(false)
  const navigate = useNavigate()

  const handleClick = () => {
    if (!clickedYear) {
      setActive(true)
      onClick(year)
      setTimeout(() => {
        navigate(`/archives/${year}`, {
          state: { view: "folder", from: "/archives" },
        })
      }, 1500) // wait for animation
    }
  }

  const shouldHide = clickedYear && clickedYear !== year

  return (
    !shouldHide && (
      <div
        className={`minimal-folder 
    ${active ? "open" : ""} 
    ${clickedYear && clickedYear !== year ? "fade-out" : ""} 
    ${className || ""}
  `}
        style={style}
        onClick={handleClick}
      >
        <div className="folder-label">{year}</div>
        <div className="folder-flap" />
        <div className="folder-panel" />
        {active && (
          <>
            <div className="paper paper1" />
            <div className="paper paper2" />
            <div className="paper paper3" />
          </>
        )}
      </div>
    )
  )
}

export default Folder
