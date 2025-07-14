export function setupMobileNav() {
  const navLinks = document.querySelectorAll(".nav__link")
  const navMenu = document.getElementById("nav-menu")
  const navToggle = document.getElementById("nav-toggle")
  const navClose = document.getElementById("nav-close")
  const header = document.getElementById("header")

  const isMobile = () => window.innerWidth <= 790

  const closeMenu = () => {
    navMenu?.classList.remove("show-menu")
  }

  const toggleMenu = () => {
    navMenu?.classList.toggle("show-menu")
  }

  const handleLinkClick = () => {
    if (isMobile()) closeMenu()
  }

  const scrollHeader = () => {
    if (window.scrollY >= 80) {
      header?.classList.add("scroll-header")
    } else {
      header?.classList.remove("scroll-header")
    }
  }

  // Attach event listeners
  navLinks.forEach((link) => link.addEventListener("click", handleLinkClick))
  navToggle?.addEventListener("click", toggleMenu)
  navClose?.addEventListener("click", closeMenu)
  window.addEventListener("scroll", scrollHeader)

  // Cleanup
  return () => {
    navLinks.forEach((link) =>
      link.removeEventListener("click", handleLinkClick)
    )
    navToggle?.removeEventListener("click", toggleMenu)
    navClose?.removeEventListener("click", closeMenu)
    window.removeEventListener("scroll", scrollHeader)
  }
}
