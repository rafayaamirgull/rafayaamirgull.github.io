document.addEventListener("DOMContentLoaded", () => {
  // Loading screen
  const loadingScreen = document.getElementById("loading-screen");
  setTimeout(() => {
    loadingScreen.classList.add("hide");
  }, 2000);

  // Three.js Scenes Initialization
  initThreeScenes();

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

  // Enhanced section reveal animation with stagger and smooth transitions
  const sections = document.querySelectorAll(".section");
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add("visible");
          }, index * 150); // Reduced stagger for smoother feel
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -50px 0px" } // Adjusted threshold and margin for earlier trigger
  );

  sections.forEach((section) => {
    observer.observe(section);
  });

  // Smooth scrolling for navigation links with easing and improved performance
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // Add smooth transitions to all interactive elements
  const interactiveElements = document.querySelectorAll(
    "button, a, .project-card, .skill-category, .timeline-item, .education-card, .social-icon"
  );
  interactiveElements.forEach((element) => {
    element.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
  });

  // Form submission using Formspree (now handled by HTML form action, but keeping JS for custom handling if needed)
  // The form now uses the action attribute for submission, but we can keep this for potential enhancements
});

// Three.js Scenes
function initThreeScenes() {
  // Check for WebGL support
  if (!window.WebGLRenderingContext) {
    console.warn("WebGL not supported, 3D scenes disabled");
    return;
  }

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Hero Scene
  const heroCanvas = document.getElementById("hero-canvas");
  if (heroCanvas) {
    const heroScene = new THREE.Scene();
    const heroCamera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const heroRenderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    heroRenderer.setSize(window.innerWidth, window.innerHeight);
    heroCanvas.appendChild(heroRenderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    heroScene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    heroScene.add(directionalLight);

    // Floating geometric shapes
    const geometries = [
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.SphereGeometry(0.5, 32, 32),
      new THREE.CylinderGeometry(0.5, 0.5, 1, 32),
      new THREE.TetrahedronGeometry(0.8),
      new THREE.OctahedronGeometry(0.7),
    ];

    const materials = [
      new THREE.MeshLambertMaterial({ color: 0x4a90e2 }),
      new THREE.MeshLambertMaterial({ color: 0x357ebd }),
      new THREE.MeshLambertMaterial({ color: 0x2c5aa0 }),
      new THREE.MeshLambertMaterial({ color: 0x1e3f73 }),
      new THREE.MeshLambertMaterial({ color: 0x0d2b50 }),
    ];

    const cubes = [];
    for (let i = 0; i < 15; i++) {
      const geometry =
        geometries[Math.floor(Math.random() * geometries.length)];
      const material = materials[Math.floor(Math.random() * materials.length)];
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      );
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      heroScene.add(mesh);
      cubes.push(mesh);
    }

    heroCamera.position.z = 10;

    // Mouse interaction
    let mouseX = 0,
      mouseY = 0;
    document.addEventListener("mousemove", (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // Animation loop for hero
    function animateHero() {
      requestAnimationFrame(animateHero);
      if (!prefersReducedMotion) {
        cubes.forEach((cube, index) => {
          cube.rotation.x += 0.01 * (index + 1) * 0.1;
          cube.rotation.y += 0.01 * (index + 1) * 0.1;
          cube.position.x += Math.sin(Date.now() * 0.001 + index) * 0.005;
          cube.position.y += Math.cos(Date.now() * 0.001 + index) * 0.005;
        });

        heroCamera.position.x += (mouseX * 2 - heroCamera.position.x) * 0.05;
        heroCamera.position.y += (mouseY * 2 - heroCamera.position.y) * 0.05;
        heroCamera.lookAt(heroScene.position);
      }

      heroRenderer.render(heroScene, heroCamera);
    }
    animateHero();

    // Resize handler for hero
    window.addEventListener("resize", () => {
      heroCamera.aspect = window.innerWidth / window.innerHeight;
      heroCamera.updateProjectionMatrix();
      heroRenderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  // Projects Scene
  const projectsCanvas = document.getElementById("projects-canvas");
  if (projectsCanvas) {
    const projectsScene = new THREE.Scene();
    const projectsCamera = new THREE.PerspectiveCamera(
      75,
      projectsCanvas.clientWidth / projectsCanvas.clientHeight,
      0.1,
      1000
    );
    const projectsRenderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    projectsRenderer.setSize(
      projectsCanvas.clientWidth,
      projectsCanvas.clientHeight
    );
    projectsCanvas.appendChild(projectsRenderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    projectsScene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    projectsScene.add(directionalLight);

    // Rotating robot arm (simplified)
    const armGroup = new THREE.Group();

    // Base
    const baseGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 32);
    const baseMaterial = new THREE.MeshLambertMaterial({ color: 0x4a90e2 });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    armGroup.add(base);

    // Arm segments
    const arm1Geometry = new THREE.BoxGeometry(0.1, 1, 0.1);
    const arm1Material = new THREE.MeshLambertMaterial({ color: 0x357ebd });
    const arm1 = new THREE.Mesh(arm1Geometry, arm1Material);
    arm1.position.y = 0.6;
    armGroup.add(arm1);

    const arm2Geometry = new THREE.BoxGeometry(0.1, 0.8, 0.1);
    const arm2Material = new THREE.MeshLambertMaterial({ color: 0x2c5aa0 });
    const arm2 = new THREE.Mesh(arm2Geometry, arm2Material);
    arm2.position.y = 1.1;
    arm2.position.x = 0.4;
    armGroup.add(arm2);

    // Gripper
    const gripperGeometry = new THREE.BoxGeometry(0.05, 0.2, 0.05);
    const gripperMaterial = new THREE.MeshLambertMaterial({ color: 0x1e3f73 });
    const gripper1 = new THREE.Mesh(gripperGeometry, gripperMaterial);
    gripper1.position.set(0.6, 1.3, 0.05);
    armGroup.add(gripper1);
    const gripper2 = new THREE.Mesh(gripperGeometry, gripperMaterial);
    gripper2.position.set(0.6, 1.3, -0.05);
    armGroup.add(gripper2);

    projectsScene.add(armGroup);
    projectsCamera.position.z = 3;

    // Animation loop for projects
    function animateProjects() {
      requestAnimationFrame(animateProjects);
      if (!prefersReducedMotion) {
        armGroup.rotation.y += 0.01;
        arm1.rotation.z += 0.005;
        arm2.rotation.z -= 0.007;
      }
      projectsRenderer.render(projectsScene, projectsCamera);
    }
    animateProjects();

    // Resize handler for projects
    window.addEventListener("resize", () => {
      projectsCamera.aspect =
        projectsCanvas.clientWidth / projectsCanvas.clientHeight;
      projectsCamera.updateProjectionMatrix();
      projectsRenderer.setSize(
        projectsCanvas.clientWidth,
        projectsCanvas.clientHeight
      );
    });
  }

  // Skills Scene with Dynamic Particle Effects
  const skillsCanvas = document.getElementById("skills-canvas");
  if (skillsCanvas && !isMobile) {
    const skillsScene = new THREE.Scene();
    const skillsCamera = new THREE.PerspectiveCamera(
      75,
      skillsCanvas.clientWidth / skillsCanvas.clientHeight,
      0.1,
      1000
    );
    const skillsRenderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    skillsRenderer.setSize(skillsCanvas.clientWidth, skillsCanvas.clientHeight);
    skillsRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    skillsCanvas.appendChild(skillsRenderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    skillsScene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(1, 1, 1);
    skillsScene.add(directionalLight);

    // Dynamic Particle System for Skills
    const skillCategories = [
      { name: "Programming", count: 7, color: 0x4a90e2 },
      { name: "Software Dev", count: 10, color: 0x357ebd },
      { name: "Robotics", count: 6, color: 0x2c5aa0 },
      { name: "ML/DL", count: 6, color: 0x1e3f73 },
      { name: "Computer Vision", count: 11, color: 0x0d2b50 },
      { name: "Data Analytics", count: 7, color: 0x06325a },
    ];

    const skillParticles = [];
    const particleGroups = [];

    skillCategories.forEach((category, categoryIndex) => {
      const group = new THREE.Group();
      const particles = [];

      for (let i = 0; i < category.count * 10; i++) {
        const geometry = new THREE.SphereGeometry(
          0.02 + Math.random() * 0.03,
          8,
          8
        );
        const material = new THREE.MeshPhongMaterial({
          color: category.color,
          transparent: true,
          opacity: 0.8,
        });
        const particle = new THREE.Mesh(geometry, material);

        // Position particles in clusters
        const angle = (i / (category.count * 10)) * Math.PI * 2;
        const radius = 1 + Math.random() * 0.5;
        const height = (Math.random() - 0.5) * 2;

        particle.position.set(
          Math.cos(angle) * radius + (categoryIndex - 2.5) * 1.5,
          height,
          Math.sin(angle) * radius
        );

        particle.userData = {
          originalY: particle.position.y,
          speed: 0.005 + Math.random() * 0.01,
          amplitude: 0.1 + Math.random() * 0.2,
        };

        group.add(particle);
        particles.push(particle);
      }

      skillsScene.add(group);
      particleGroups.push(group);
      skillParticles.push(...particles);
    });

    skillsCamera.position.set(0, 0, 6);

    // Mouse interaction for skills
    let mouseX_skills = 0,
      mouseY_skills = 0;
    skillsCanvas.addEventListener("mousemove", (event) => {
      const rect = skillsCanvas.getBoundingClientRect();
      mouseX_skills = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY_skills = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    });

    // Animation loop for skills
    function animateSkills() {
      requestAnimationFrame(animateSkills);
      if (!prefersReducedMotion) {
        skillParticles.forEach((particle, index) => {
          // Floating animation
          particle.position.y =
            particle.userData.originalY +
            Math.sin(Date.now() * particle.userData.speed + index) *
              particle.userData.amplitude;

          // Rotation
          particle.rotation.x += 0.01;
          particle.rotation.y += 0.005;

          // Mouse interaction - particles move away from mouse
          const distance = particle.position.distanceTo(
            new THREE.Vector3(mouseX_skills * 3, mouseY_skills * 2, 0)
          );
          if (distance < 2) {
            const force = (2 - distance) * 0.02;
            particle.position.x +=
              (particle.position.x - mouseX_skills * 3) * force;
            particle.position.y +=
              (particle.position.y - mouseY_skills * 2) * force;
          }
        });

        // Rotate particle groups slowly
        particleGroups.forEach((group, index) => {
          group.rotation.y += 0.002 * (index % 2 === 0 ? 1 : -1);
        });

        // Camera subtle movement
        skillsCamera.position.x +=
          (mouseX_skills * 0.5 - skillsCamera.position.x) * 0.02;
        skillsCamera.lookAt(skillsScene.position);
      }
      skillsRenderer.render(skillsScene, skillsCamera);
    }
    animateSkills();

    // Resize handler for skills
    window.addEventListener("resize", () => {
      skillsCamera.aspect =
        skillsCanvas.clientWidth / skillsCanvas.clientHeight;
      skillsCamera.updateProjectionMatrix();
      skillsRenderer.setSize(
        skillsCanvas.clientWidth,
        skillsCanvas.clientHeight
      );
    });
  }
}
