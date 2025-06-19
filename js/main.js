document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("header");
  const navLinks = document.getElementById("nav-links");
  const menuToggle = document.getElementById("menu-toggle");

  // Mobile menu toggle
  function toggleNav() {
    navLinks.classList.toggle("show");
    const menuIcon = menuToggle.querySelector("i");
    if (navLinks.classList.contains("show")) {
      menuIcon.classList.remove("fa-bars");
      menuIcon.classList.add("fa-times");
    } else {
      menuIcon.classList.remove("fa-times");
      menuIcon.classList.add("fa-bars");
    }
  }

  if (menuToggle) {
    menuToggle.addEventListener("click", toggleNav);
  }

  // Close mobile menu when a link is clicked
  document.querySelectorAll("#nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      if (navLinks.classList.contains("show")) {
        toggleNav();
      }
    });
  });

  // Sticky header on scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // Section reveal animation
  const sections = document.querySelectorAll(".section");
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  sections.forEach((section) => {
    observer.observe(section);
  });

  // Form submission (prevent default for demo)
  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert(
        "Form submission would be handled here. In a real implementation, this would send data to a server."
      );
      contactForm.reset();
    });
  }
});
