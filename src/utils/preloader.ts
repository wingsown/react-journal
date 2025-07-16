export const preloader = (loaderId: string = "preloader") => {
  window.addEventListener("load", () => {
    const loader = document.getElementById(loaderId)
    if (loader) {
      loader.classList.add("fade-out")
      setTimeout(() => {
        loader.style.display = "none"
      }, 400)
    }
  })
}
