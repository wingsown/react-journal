import React from "react"
import "../css/Footer.css"

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      {/* <div class="footer__bg"> */}
      <div className="footer__container container grid">
        <div>
          {/* <h1 class="footer__title">Wilson</h1>
              <span class="footer__subtitle">Frontend Developer</span> */}
          {/* <ul class="footer__links">
              <li>
                <a href="#about" class="footer__link">About</a>
              </li>
              <li>
                <a href="#services" class="footer__link">Services</a>
              </li>
              <li>
                <a href="#portfolio" class="footer__link">Portfolio</a>
              </li>
            </ul> */}
        </div>
        {/* <div class="footer__socials">
          <a
            href="https://www.linkedin.com/in/wilsonbuena"
            target="_blank"
            class="footer__social"
          >
            <i class="uil uil-linkedin"></i>
          </a>
          <a
            href="https://www.github.com/wingsown"
            target="_blank"
            class="footer__social"
          >
            <i class="uil uil-github"></i>
          </a>
          <a
            href="https://www.instagram.com/wilsonbuena"
            target="_blank"
            class="footer__social"
          >
            <i class="uil uil-instagram"></i>
          </a>
        </div> */}
      </div>

      <p className="footer__copy">
        Coded with
        {/*&#128526;*/}
        &#10084;&#65039; by Wilson
        {/*&#169;*/}
        {/*<span id="date"></span>*/}
      </p>
      {/* </div> */}
    </footer>
  )
}

export default Footer
