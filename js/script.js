// fadein + preloader combined (put this at end of body or in your script file)
(function() {
  window.addEventListener("load", () => {
    const preloader = document.getElementById("preloader");
    if (preloader) {
      preloader.style.transition = "opacity 0.5s ease";
      preloader.style.opacity = "0";
      setTimeout(() => { preloader.style.display = "none"; }, 500);
    }
  });

  document.addEventListener("DOMContentLoaded", () => {
    const faders = document.querySelectorAll('.fade-in');
    console.log('[fadein] elements found:', faders.length);

    if (faders.length === 0) return;

    const appearOptions = {
      threshold: 0.12,                // ~12% visible
      rootMargin: "0px 0px -80px 0px" // trigger slightly before fully in view
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          console.log('[fadein] visible:', entry.target.id || entry.target.className);
          entry.target.classList.add('visible');
          obs.unobserve(entry.target); // animate once
        }
      });
    }, appearOptions);

    faders.forEach(f => observer.observe(f));
  });
})();
