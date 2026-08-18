import React, { useState } from "react"
import "../assets/css/Folder.css"
import { BlogPost } from "../types/blogData"
import { useNavigate } from "react-router-dom"

interface FolderProps {
  label: string
  posts: BlogPost[]
  clickedLabel: string | null 
  onClickLabel: (label: string) => void
  className?: string
  style?: React.CSSProperties
  type?: "year" | "country" | "region"
  basePath?: string
}

const Folder: React.FC<FolderProps> = ({
  label,
  posts,
  clickedLabel,
  onClickLabel,
  type = "year",
  style,
  className,
  basePath
}) => {
  const [active, setActive] = useState(false)
  const navigate = useNavigate()

  const handleClick = () => {
    if (!clickedLabel) {
      setActive(true)
      onClickLabel(label)
      const path = basePath || (type === "country" ? "/country" : type === "region" ? "/region" : "/archives")
      setTimeout(() => {
        navigate(`${path}/${label}`, {
          state: { view: "folder", from: "/archives" }
        })
      }, 1500) // wait for animation
    }
  }

  const shouldHide = clickedLabel && clickedLabel !== label

  return (
    !shouldHide && (
      <div
        className={`minimal-folder 
    ${active ? "open" : ""} 
    ${clickedLabel && clickedLabel !== label ? "fade-out" : ""} 
    ${className || ""}
  `}
        style={style}
        onClick={handleClick}
      >
        <div className="folder-label">{label}</div>
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
