import React from "react"
import "../css/Header.css"

const Header: React.FC = () => {
  return (
    <header className="header" id="header">
      <nav className="nav container">
        <a href="#" className="nav__logo">
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
              <a href="#home" className="nav__link active-link">
                <i className="uil uil-book nav__icon"></i> Archive
              </a>
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
