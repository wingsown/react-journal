export function setupMobileNav() {
  const navLinks = document.querySelectorAll(".nav__link")
  const navMenu = document.getElementById("nav-menu")
  const navToggle = document.getElementById("nav-toggle")
  const navClose = document.getElementById("nav-close")

  const isMobile = () => window.innerWidth <= 790

  const closeMenu = () => {
    navMenu?.classList.remove("show-menu")
  }

  const toggleMenu = () => {
    navMenu?.classList.toggle("show-menu")
  }

  // Add listeners
  navLinks.forEach((link) =>
    link.addEventListener("click", () => {
      if (isMobile()) closeMenu()
    })
  )

  navToggle?.addEventListener("click", toggleMenu)
  navClose?.addEventListener("click", closeMenu)

  // Cleanup
  return () => {
    navLinks.forEach((link) => link.removeEventListener("click", closeMenu))
    navToggle?.removeEventListener("click", toggleMenu)
    navClose?.removeEventListener("click", closeMenu)
  }
}
