document.addEventListener("DOMContentLoaded", () => {
  // Section reveal on scroll
  const sections = document.querySelectorAll(".section");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("visible");
      });
    },
    { threshold: 0.2 }
  );
  sections.forEach((s) => observer.observe(s));

  // Smooth scroll
  document.querySelectorAll("nav a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      document
        .querySelector(link.getAttribute("href"))
        .scrollIntoView({ behavior: "smooth" });
    });
  });
});
function toggleNav() {
  const nav = document.getElementById("nav-links");
  nav.classList.toggle("show");
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(
      (e) => e.isIntersecting && e.target.classList.add("visible")
    );
  },
  { threshold: 0.2 }
);

document.querySelectorAll(".section").forEach((s) => observer.observe(s));
