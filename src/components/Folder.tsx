import React, { useState } from "react"
import "../assets/css/Folder.css"

const Folder = () => {
  const [active, setActive] = useState(false)
  const [hideFolder, setHideFolder] = useState(false)

  const handleClick = () => {
    setActive(true)
    setTimeout(() => {
      setActive(false)
      setHideFolder(true)
    }, 1500)
  }
  return (
    <div>
      {!hideFolder && (
        <div
          className={`minimal-folder ${active ? "open" : ""}`}
          onClick={handleClick}
        >
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
    </div>
  )
}

export default Folder
