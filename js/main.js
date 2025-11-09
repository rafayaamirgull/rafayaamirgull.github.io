document.addEventListener("DOMContentLoaded", () => {
  // Loading screen
  const loadingScreen = document.getElementById("loading-screen");
  setTimeout(() => {
    loadingScreen.classList.add("hide");
  }, 2000);

  const header = document.getElementById("header");
  const navLinks = document.getElementById("nav-links");
  const menuToggle = document.getElementById("menu-toggle");
  const themeToggle = document.getElementById("theme-toggle");

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

  // Theme toggle
  function toggleTheme() {
    const body = document.body;
    const themeIcon = themeToggle.querySelector("i");

    if (body.classList.contains("light-mode")) {
      body.classList.remove("light-mode");
      themeIcon.classList.remove("fa-sun");
      themeIcon.classList.add("fa-moon");
      localStorage.setItem("theme", "dark");
    } else {
      body.classList.add("light-mode");
      themeIcon.classList.remove("fa-moon");
      themeIcon.classList.add("fa-sun");
      localStorage.setItem("theme", "light");
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }

  // Load saved theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
    const themeIcon = themeToggle.querySelector("i");
    themeIcon.classList.remove("fa-moon");
    themeIcon.classList.add("fa-sun");
  }

  // Parallax effect
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    const hero = document.querySelector(".hero");
    if (hero) {
      hero.style.transform = `translateY(${rate}px)`;
    }
  });

  // Enhanced section reveal animation with stagger
  const sections = document.querySelectorAll(".section");
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add("visible");
          }, index * 200);
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
