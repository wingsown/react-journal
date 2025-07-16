import React, { useEffect } from "react"
import "../assets/css/Header.css"
import "../index.css"
import { setupMobileNav } from "../utils/navBar"
import { NavLink } from "react-router-dom"

const Header: React.FC = () => {
  useEffect(() => {
    const cleanup = setupMobileNav()
    return cleanup
  }, [])

  return (
    <header className="header" id="header">
      <nav className="nav container">
        <a href="/" className="nav__logo">
          {/* <img
            src="assets/img/Icon_4.png"
            alt=""
            className="nav__logo-img logo-img"
            id="logo-img"
          /> */}
          Journal
        </a>

        <div className="nav__menu" id="nav-menu">
          <ul className="nav__list grid">
            <li className="nav__item">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "nav__link active-link" : "nav__link"
                }
              >
                <i className="uil uil-edit nav__icon"></i> Home
              </NavLink>
            </li>
            <li className="nav__item">
              <NavLink
                to="/archives"
                className={({ isActive }) =>
                  isActive ? "nav__link active-link" : "nav__link"
                }
              >
                <i className="uil uil-book nav__icon"></i> Archives
              </NavLink>
            </li>
            <li className="nav__item">
              <NavLink
                to="/photos"
                className={({ isActive }) =>
                  isActive ? "nav__link active-link" : "nav__link"
                }
              >
                <i className="uil uil-camera nav__icon"></i> Photos
              </NavLink>
            </li>
            {/* <li className="nav__item">
              <a href="#contact" className="nav__link">
                <i className="uil uil-message nav__icon"></i> Contact
              </a>
            </li> */}
          </ul>
          <i className="uil uil-times nav__close" id="nav-close"></i>
        </div>

        <div className="nav__btns">
          {/* Theme change button */}
          {/* <i className="uil uil-moon-eclipse change-theme" id="theme-button"></i> */}
          <div className="nav__toggle" id="nav-toggle">
            <i className="uil uil-apps"></i>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
