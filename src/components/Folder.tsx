import React, { useState } from "react"
import "../assets/css/Folder.css"
import { BlogPost } from "../types/blogData"

interface FolderProps {
  year: string
  posts: BlogPost[]
}

const Folder: React.FC<FolderProps> = ({ year, posts }) => {
  const [active, setActive] = useState(false)
  const [hideFolder, setHideFolder] = useState(false)

  const handleClick = () => {
    setActive(true)
    setTimeout(() => {
      setActive(false)
      setHideFolder(true)

      // TODO: Add routing or reveal blog list here if needed
    }, 1500)
  }

  return (
    <>
      {!hideFolder && (
        <div
          className={`minimal-folder ${active ? "open" : ""}`}
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
      )}
    </>
  )
}

export default Folder
