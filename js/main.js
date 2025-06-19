document.addEventListener("DOMContentLoaded", () => {
  // Mobile menu toggle
  function toggleNav() {
    const nav = document.getElementById("nav-links");
    nav.classList.toggle("show");
  }

  // Smooth scroll for navigation links
  document.querySelectorAll('nav a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        // Close mobile menu if open
        const nav = document.getElementById("nav-links");
        nav.classList.remove("show");

        // Smooth scroll to target
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        });
      }
    });
  });

  // Section reveal animation
  const sections = document.querySelectorAll(".section");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.1 }
  );

  sections.forEach((section) => {
    observer.observe(section);
  });

  // Sticky header on scroll
  window.addEventListener("scroll", () => {
    const header = document.querySelector("nav");
    if (window.scrollY > 100) {
      header.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
    } else {
      header.style.boxShadow = "none";
    }
  });
});
