document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll("#background-container .bg-image");
  let currentIndex = 0;

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const sectionHeight = window.innerHeight;

    const newIndex = Math.min(
      images.length - 1,
      Math.floor(scrollY / sectionHeight)
    );

    if (newIndex !== currentIndex) {
      images[currentIndex].classList.remove("active");
      images[newIndex].classList.add("active");
      currentIndex = newIndex;
    }
  });
});
