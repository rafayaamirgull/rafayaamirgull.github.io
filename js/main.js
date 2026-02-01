document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("js");
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Loading screen
  const loadingScreen = document.getElementById("loading-screen");
  setTimeout(() => {
    loadingScreen.classList.add("hide");
  }, 2000);

  // Three.js Scenes Initialization
  try {
    initThreeScenes();
  } catch (error) {
    console.error("Three.js initialization failed:", error);
  }

  const header = document.getElementById("header");
  const navLinks = document.getElementById("nav-links");
  const menuToggle = document.getElementById("menu-toggle");
  const themeToggle = document.getElementById("theme-toggle");

  // Mobile menu toggle
  function toggleNav() {
    navLinks.classList.toggle("show");
    const menuIcon = menuToggle.querySelector("i");
    const isOpen = navLinks.classList.contains("show");
    menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    if (isOpen) {
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
  if (!prefersReducedMotion) {
    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      const hero = document.querySelector(".hero");
      if (hero) {
        hero.style.transform = `translateY(${rate}px)`;
      }
    });
  }

  // Enhanced section reveal animation with stagger and smooth transitions
  const sections = document.querySelectorAll(".section");
  if (!("IntersectionObserver" in window)) {
    sections.forEach((section) => section.classList.add("visible"));
  } else if (prefersReducedMotion) {
    sections.forEach((section) => section.classList.add("visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("visible");
            }, index * 150);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );

    sections.forEach((section) => {
      observer.observe(section);
    });
  }

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

  // Draggable Projects GIF
  const projectsGif = document.querySelector(".projects-gif");
  if (projectsGif) {
    initDraggableMedia(projectsGif);
  }

  // Form submission using Formspree (now handled by HTML form action, but keeping JS for custom handling if needed)
  // The form now uses the action attribute for submission, but we can keep this for potential enhancements
});

function initDraggableMedia(container) {
  const img = container.querySelector("img");
  if (!img) return;

  img.setAttribute("draggable", "false");

  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let offsetX = 0;
  let offsetY = 0;
  let bounds = { minX: 0, maxX: 0, minY: 0, maxY: 0 };
  let initialized = false;

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function applyTransform() {
    img.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  }

  function recalcBounds() {
    const rect = container.getBoundingClientRect();
    const containerWidth = rect.width;
    const containerHeight = rect.height;
    const naturalWidth = img.naturalWidth || containerWidth;
    const naturalHeight = img.naturalHeight || containerHeight;
    const scale = Math.max(
      containerWidth / naturalWidth,
      containerHeight / naturalHeight
    );
    const imageWidth = naturalWidth * scale;
    const imageHeight = naturalHeight * scale;

    img.style.width = `${imageWidth}px`;
    img.style.height = `${imageHeight}px`;

    if (imageWidth <= containerWidth) {
      bounds.minX = bounds.maxX = (containerWidth - imageWidth) / 2;
    } else {
      bounds.minX = containerWidth - imageWidth;
      bounds.maxX = 0;
    }

    if (imageHeight <= containerHeight) {
      bounds.minY = bounds.maxY = (containerHeight - imageHeight) / 2;
    } else {
      bounds.minY = containerHeight - imageHeight;
      bounds.maxY = 0;
    }

    if (!initialized) {
      offsetX = (bounds.minX + bounds.maxX) / 2;
      offsetY = (bounds.minY + bounds.maxY) / 2;
      initialized = true;
    } else {
      offsetX = clamp(offsetX, bounds.minX, bounds.maxX);
      offsetY = clamp(offsetY, bounds.minY, bounds.maxY);
    }

    applyTransform();
  }

  if (img.complete && img.naturalWidth) {
    recalcBounds();
  } else {
    img.addEventListener("load", recalcBounds, { once: true });
  }

  window.addEventListener("resize", recalcBounds);

  container.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    isDragging = true;
    container.classList.add("dragging");
    container.setPointerCapture(event.pointerId);
    startX = event.clientX - offsetX;
    startY = event.clientY - offsetY;
  });

  container.addEventListener("pointermove", (event) => {
    if (!isDragging) return;
    offsetX = clamp(event.clientX - startX, bounds.minX, bounds.maxX);
    offsetY = clamp(event.clientY - startY, bounds.minY, bounds.maxY);
    applyTransform();
  });

  function endDrag(event) {
    if (!isDragging) return;
    isDragging = false;
    container.classList.remove("dragging");
    if (container.hasPointerCapture(event.pointerId)) {
      container.releasePointerCapture(event.pointerId);
    }
  }

  container.addEventListener("pointerup", endDrag);
  container.addEventListener("pointercancel", endDrag);
}

// Three.js Scenes
function initThreeScenes() {
  // Check for WebGL support
  if (!window.WebGLRenderingContext) {
    console.warn("WebGL not supported, 3D scenes disabled");
    return;
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

  // Hero Scene - Neural Network + Active Perception Scan
  const heroCanvas = document.getElementById("hero-canvas");
  if (heroCanvas && heroCanvas.offsetParent !== null) {
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
    heroRenderer.setPixelRatio(pixelRatio);
    heroRenderer.setSize(window.innerWidth, window.innerHeight);
    heroRenderer.outputEncoding = THREE.sRGBEncoding;
    heroCanvas.appendChild(heroRenderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    heroScene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(1, 1, 1);
    heroScene.add(directionalLight);

    const nodes = [];
    const nodeCount = 150;
    const connectionDistance = 5;
    const nodeGeometry = new THREE.SphereGeometry(0.15, 16, 16);

    for (let i = 0; i < nodeCount; i++) {
      const nodeMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: 0.3,
        roughness: 0.1,
        emissive: 0xb8860b,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.9,
      });
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      node.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10
      );
      node.userData = {
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        ),
        phase: Math.random() * Math.PI * 2,
      };
      heroScene.add(node);
      nodes.push(node);
    }

    const connections = [];
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x357ebd,
      transparent: true,
      opacity: 0.3,
    });

    function updateConnections() {
      connections.forEach((conn) => heroScene.remove(conn));
      connections.length = 0;

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const distance = nodes[i].position.distanceTo(nodes[j].position);
          if (distance < connectionDistance) {
            const geometry = new THREE.BufferGeometry().setFromPoints([
              nodes[i].position,
              nodes[j].position,
            ]);
            const line = new THREE.Line(geometry, lineMaterial.clone());
            line.userData = { node1: nodes[i], node2: nodes[j] };
            heroScene.add(line);
            connections.push(line);
          }
        }
      }
    }

    updateConnections();

    const scanGroup = new THREE.Group();
    scanGroup.position.set(0, -2, 0);
    const scanRings = [];
    const ringGeometry = new THREE.RingGeometry(1.6, 1.9, 64);
    for (let i = 0; i < 3; i++) {
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0x33d1ff,
        transparent: true,
        opacity: 0.4 - i * 0.1,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2;
      ring.userData = {
        speed: 0.008 + i * 0.002,
        maxScale: 4.5,
        baseOpacity: 0.4 - i * 0.1,
      };
      ring.scale.setScalar(1 + i * 0.7);
      scanGroup.add(ring);
      scanRings.push(ring);
    }
    heroScene.add(scanGroup);

    const rayCount = 12;
    const rayPositions = new Float32Array(rayCount * 2 * 3);
    for (let i = 0; i < rayCount; i++) {
      const angle = (i / rayCount) * Math.PI * 2;
      const radius = 4.2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = -1.4;
      rayPositions[i * 6] = 0;
      rayPositions[i * 6 + 1] = 0;
      rayPositions[i * 6 + 2] = 0;
      rayPositions[i * 6 + 3] = x;
      rayPositions[i * 6 + 4] = y;
      rayPositions[i * 6 + 5] = z;
    }
    const rayGeometry = new THREE.BufferGeometry();
    rayGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(rayPositions, 3)
    );
    const rayMaterial = new THREE.LineBasicMaterial({
      color: 0x33d1ff,
      transparent: true,
      opacity: 0.25,
    });
    const rayGroup = new THREE.Group();
    const rays = new THREE.LineSegments(rayGeometry, rayMaterial);
    rayGroup.add(rays);
    rayGroup.position.set(0, -1.2, 0);
    heroScene.add(rayGroup);

    const sensorCore = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 16, 16),
      new THREE.MeshBasicMaterial({
        color: 0x33d1ff,
        transparent: true,
        opacity: 0.85,
      })
    );
    sensorCore.position.set(0, -1.2, 0);
    heroScene.add(sensorCore);

    heroCamera.position.z = 12;

    let mouseX = 0,
      mouseY = 0,
      mouseZ = 0;
    let mouseWorldPos = new THREE.Vector3();
    let hoveredNode = null;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    document.addEventListener("mousemove", (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      mouseZ = 0.5;

      mouseWorldPos.set(mouseX, mouseY, mouseZ);
      mouseWorldPos.unproject(heroCamera);
      mouseWorldPos.sub(heroCamera.position).normalize();
      mouseWorldPos.multiplyScalar(10);
      mouseWorldPos.add(heroCamera.position);

      mouse.x = mouseX;
      mouse.y = mouseY;

      raycaster.setFromCamera(mouse, heroCamera);
      const intersects = raycaster.intersectObjects(nodes);

      if (hoveredNode) {
        hoveredNode.material.emissive.setHex(0xb8860b);
        hoveredNode.material.emissiveIntensity = 0.3;
        hoveredNode.scale.setScalar(1);
        hoveredNode = null;
      }

      if (intersects.length > 0) {
        hoveredNode = intersects[0].object;
        hoveredNode.material.emissive.setHex(0xffd700);
        hoveredNode.material.emissiveIntensity = 0.8;
        hoveredNode.scale.setScalar(1.5);
      }
    });

    function animateHero() {
      requestAnimationFrame(animateHero);
      if (!prefersReducedMotion) {
        const time = Date.now() * 0.001;

        nodes.forEach((node, index) => {
          node.position.x +=
            Math.sin(time + node.userData.phase) * 0.005 +
            node.userData.velocity.x;
          node.position.y +=
            Math.cos(time * 0.7 + node.userData.phase) * 0.005 +
            node.userData.velocity.y;
          node.position.z +=
            Math.sin(time * 0.5 + node.userData.phase) * 0.003 +
            node.userData.velocity.z;

          if (node !== hoveredNode) {
            const distanceToMouse = node.position.distanceTo(mouseWorldPos);
            if (distanceToMouse < 5) {
              const force = new THREE.Vector3()
                .subVectors(mouseWorldPos, node.position)
                .normalize()
                .multiplyScalar(0.02 / (distanceToMouse + 1));
              node.position.add(force);
            }
          } else {
            node.position.lerp(mouseWorldPos, 0.05);
          }

          if (Math.abs(node.position.x) > 12) node.userData.velocity.x *= -1;
          if (Math.abs(node.position.y) > 10) node.userData.velocity.y *= -1;
          if (Math.abs(node.position.z) > 8) node.userData.velocity.z *= -1;

          if (node === hoveredNode) {
            node.material.emissiveIntensity = 0.8 + Math.sin(time * 4) * 0.2;
          } else {
            node.material.emissiveIntensity =
              0.1 + Math.sin(time * 2 + index) * 0.05;
          }
        });

        connections.forEach((connection) => {
          const geometry = connection.geometry;
          const positions = geometry.attributes.position.array;
          positions[0] = connection.userData.node1.position.x;
          positions[1] = connection.userData.node1.position.y;
          positions[2] = connection.userData.node1.position.z;
          positions[3] = connection.userData.node2.position.x;
          positions[4] = connection.userData.node2.position.y;
          positions[5] = connection.userData.node2.position.z;
          geometry.attributes.position.needsUpdate = true;

          const midPoint = new THREE.Vector3()
            .addVectors(
              connection.userData.node1.position,
              connection.userData.node2.position
            )
            .multiplyScalar(0.5);
          const distanceToMouse = midPoint.distanceTo(mouseWorldPos);
          connection.material.opacity = distanceToMouse < 3 ? 0.8 : 0.3;
        });

        scanRings.forEach((ring) => {
          ring.scale.addScalar(ring.userData.speed);
          ring.material.opacity -= ring.userData.speed * 0.12;
          if (ring.scale.x > ring.userData.maxScale) {
            ring.scale.setScalar(1);
            ring.material.opacity = ring.userData.baseOpacity;
          }
        });

        rayGroup.rotation.y += 0.002;

        heroCamera.position.x += (mouseX * 1 - heroCamera.position.x) * 0.02;
        heroCamera.position.y += (mouseY * 1 - heroCamera.position.y) * 0.02;
        heroCamera.lookAt(heroScene.position);
      }

      heroRenderer.render(heroScene, heroCamera);
    }
    animateHero();

    window.addEventListener("resize", () => {
      heroCamera.aspect = window.innerWidth / window.innerHeight;
      heroCamera.updateProjectionMatrix();
      heroRenderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  // Projects Scene - Lucy Spotlight
  const projectsCanvas = document.getElementById("projects-canvas");
  if (projectsCanvas && projectsCanvas.offsetParent !== null) {
    const projectsScene = new THREE.Scene();
    projectsScene.background = new THREE.Color(0x050608);
    projectsScene.fog = new THREE.FogExp2(0x050608, 0.08);

    const projectsCamera = new THREE.PerspectiveCamera(
      60,
      projectsCanvas.clientWidth / projectsCanvas.clientHeight,
      0.1,
      100
    );
    const projectsRenderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    projectsRenderer.setPixelRatio(pixelRatio);
    projectsRenderer.setSize(
      projectsCanvas.clientWidth,
      projectsCanvas.clientHeight
    );
    projectsRenderer.outputEncoding = THREE.sRGBEncoding;
    projectsRenderer.physicallyCorrectLights = true;
    projectsRenderer.shadowMap.enabled = true;
    projectsRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    projectsCanvas.appendChild(projectsRenderer.domElement);

    const groundGeometry = new THREE.PlaneGeometry(24, 24);
    const groundTexture = new THREE.TextureLoader().load("assets/disturb.jpg");
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(5, 5);
    groundTexture.encoding = THREE.sRGBEncoding;
    const groundMaterial = new THREE.MeshPhongMaterial({
      color: 0x111111,
      specular: 0x111111,
      shininess: 40,
      map: groundTexture,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    projectsScene.add(ground);

    const spotLight = new THREE.SpotLight(0xffffff, 120);
    spotLight.position.set(0, 6, 4);
    spotLight.angle = 0.55;
    spotLight.penumbra = 1;
    spotLight.decay = 2;
    spotLight.distance = 30;
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.set(1024, 1024);
    spotLight.shadow.bias = -0.0002;
    projectsScene.add(spotLight);
    projectsScene.add(spotLight.target);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.05);
    projectsScene.add(ambientLight);

    const coneHeight = 8;
    const coneRadius = Math.tan(spotLight.angle) * coneHeight;
    const spotCone = new THREE.Mesh(
      new THREE.ConeGeometry(coneRadius, coneHeight, 32, 1, true),
      new THREE.MeshBasicMaterial({
        color: 0x33d1ff,
        transparent: true,
        opacity: 0.08,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    projectsScene.add(spotCone);

    const spotHelper = new THREE.SpotLightHelper(spotLight, 0x6be7ff);
    projectsScene.add(spotHelper);

    if (THREE.PLYLoader) {
      const loader = new THREE.PLYLoader();
      loader.load(
        "assets/Lucy100k.ply",
        (geometry) => {
          geometry.computeVertexNormals();

          const textureLoader = new THREE.TextureLoader();
          const disturbTexture = textureLoader.load("assets/disturb.jpg");
          disturbTexture.wrapS = disturbTexture.wrapT = THREE.RepeatWrapping;
          disturbTexture.repeat.set(6, 6);
          disturbTexture.encoding = THREE.sRGBEncoding;

          const lucyMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            specular: 0x111111,
            shininess: 45,
            map: disturbTexture,
          });

          const mesh = new THREE.Mesh(geometry, lucyMaterial);

          geometry.computeBoundingBox();
          const box = geometry.boundingBox;
          const size = new THREE.Vector3();
          const center = new THREE.Vector3();
          box.getSize(size);
          box.getCenter(center);

          const targetSize = 1.8;
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = targetSize / maxDim;
          mesh.scale.setScalar(scale);
          mesh.position.set(
            -center.x * scale,
            -center.y * scale,
            -center.z * scale
          );
          mesh.position.y += (size.y * scale) / 2;
          mesh.rotation.y = Math.PI / 2;

          mesh.castShadow = true;
          mesh.receiveShadow = true;

          projectsScene.add(mesh);
          spotLight.target = mesh;
          spotLight.target.updateMatrixWorld();
        },
        undefined,
        (error) => {
          console.error("Error loading PLY model:", error);
        }
      );
    } else {
      console.warn("PLYLoader not available. Lucy model was not loaded.");
    }

    projectsCamera.position.set(0, 2.4, 5.2);
    projectsCamera.lookAt(0, 1.1, 0);

    const coneDirection = new THREE.Vector3();
    const upAxis = new THREE.Vector3(0, 1, 0);

    function updateSpotCone() {
      coneDirection
        .subVectors(spotLight.target.position, spotLight.position)
        .normalize();
      spotCone.position.copy(spotLight.position);
      spotCone.quaternion.setFromUnitVectors(upAxis, coneDirection);
    }

    function animateProjects() {
      requestAnimationFrame(animateProjects);
      if (!prefersReducedMotion) {
        spotCone.material.opacity = 0.07 + Math.sin(Date.now() * 0.001) * 0.01;
      }
      updateSpotCone();
      spotHelper.update();
      projectsRenderer.render(projectsScene, projectsCamera);
    }
    animateProjects();

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

  // Skills Scene - 6DOF Manipulator with Pick & Place
  const skillsCanvas = document.getElementById("skills-canvas");
  if (skillsCanvas && skillsCanvas.offsetParent !== null) {
    const skillsScene = new THREE.Scene();
    skillsScene.fog = new THREE.FogExp2(0x0b0d10, 0.12);

    const skillsCamera = new THREE.PerspectiveCamera(
      60,
      skillsCanvas.clientWidth / skillsCanvas.clientHeight,
      0.1,
      100
    );
    const skillsRenderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    skillsRenderer.setPixelRatio(pixelRatio);
    skillsRenderer.setSize(
      skillsCanvas.clientWidth,
      skillsCanvas.clientHeight
    );
    skillsRenderer.outputEncoding = THREE.sRGBEncoding;
    skillsCanvas.appendChild(skillsRenderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
    const keyLight = new THREE.DirectionalLight(0x33d1ff, 0.9);
    keyLight.position.set(4, 4, 2);
    const fillLight = new THREE.PointLight(0xf2a15f, 0.6, 8);
    fillLight.position.set(-2, 2.5, 2);
    skillsScene.add(ambientLight, keyLight, fillLight);

    // Subtle point cloud backdrop
    const particleCount = 220;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = Math.cbrt(Math.random()) * 1.4;
      const idx = i * 3;
      particlePositions[idx] = r * Math.sin(phi) * Math.cos(theta);
      particlePositions[idx + 1] = r * Math.sin(phi) * Math.sin(theta);
      particlePositions[idx + 2] = r * Math.cos(phi);
    }
    const pointsGeometry = new THREE.BufferGeometry();
    pointsGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    );
    const pointsMaterial = new THREE.PointsMaterial({
      color: 0x6be7ff,
      size: 0.02,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
    });
    const pointCloud = new THREE.Points(pointsGeometry, pointsMaterial);
    pointCloud.position.set(0.9, 1.1, -0.5);
    skillsScene.add(pointCloud);

    // 6DOF robotic arm
    const metalMaterial = new THREE.MeshStandardMaterial({
      color: 0x2c7cff,
      metalness: 0.7,
      roughness: 0.25,
      emissive: 0x05121f,
      emissiveIntensity: 0.2,
    });
    const darkMaterial = new THREE.MeshStandardMaterial({
      color: 0x1b2433,
      metalness: 0.4,
      roughness: 0.6,
    });

    const armGroup = new THREE.Group();
    armGroup.position.set(-0.7, 0, 0.3);
    skillsScene.add(armGroup);

    const baseHeight = 0.2;
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(0.38, 0.48, baseHeight, 32),
      darkMaterial
    );
    base.position.y = baseHeight / 2;
    armGroup.add(base);

    const joint0 = new THREE.Group();
    joint0.position.y = baseHeight;
    base.add(joint0);

    const upperLen = 0.95;
    const upperArm = new THREE.Mesh(
      new THREE.BoxGeometry(upperLen, 0.14, 0.14),
      metalMaterial
    );
    upperArm.position.x = upperLen / 2;
    joint0.add(upperArm);

    const joint1 = new THREE.Group();
    joint1.position.x = upperLen;
    joint0.add(joint1);

    const foreLen = 0.8;
    const foreArm = new THREE.Mesh(
      new THREE.BoxGeometry(foreLen, 0.12, 0.12),
      metalMaterial
    );
    foreArm.position.x = foreLen / 2;
    joint1.add(foreArm);

    const joint2 = new THREE.Group();
    joint2.position.x = foreLen;
    joint1.add(joint2);

    const wrist1Len = 0.3;
    const wrist1 = new THREE.Mesh(
      new THREE.BoxGeometry(wrist1Len, 0.1, 0.1),
      metalMaterial
    );
    wrist1.position.x = wrist1Len / 2;
    joint2.add(wrist1);

    const joint3 = new THREE.Group();
    joint3.position.x = wrist1Len;
    joint2.add(joint3);

    const wrist2Len = 0.25;
    const wrist2 = new THREE.Mesh(
      new THREE.BoxGeometry(wrist2Len, 0.09, 0.09),
      metalMaterial
    );
    wrist2.position.x = wrist2Len / 2;
    joint3.add(wrist2);

    const joint4 = new THREE.Group();
    joint4.position.x = wrist2Len;
    joint3.add(joint4);

    const wrist3Len = 0.2;
    const wrist3 = new THREE.Mesh(
      new THREE.BoxGeometry(wrist3Len, 0.08, 0.08),
      metalMaterial
    );
    wrist3.position.x = wrist3Len / 2;
    joint4.add(wrist3);

    const joint5 = new THREE.Group();
    joint5.position.x = wrist3Len;
    joint4.add(joint5);

    const gripper = new THREE.Group();
    joint5.add(gripper);

    const gripperLeft = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.04, 0.08),
      darkMaterial
    );
    const gripperRight = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.04, 0.08),
      darkMaterial
    );
    gripperLeft.position.set(0.1, 0.06, 0.06);
    gripperRight.position.set(0.1, 0.06, -0.06);
    gripper.add(gripperLeft, gripperRight);

    const toolTip = new THREE.Object3D();
    toolTip.position.set(0.18, 0.06, 0);
    gripper.add(toolTip);

    const joints = [
      { group: joint0, axis: "y" },
      { group: joint1, axis: "z" },
      { group: joint2, axis: "z" },
      { group: joint3, axis: "z" },
      { group: joint4, axis: "y" },
      { group: joint5, axis: "x" },
    ];

    const homePose = [0, -0.4, 0.8, -0.5, 0.2, 0.0];
    const pickPose = [-0.45, -0.85, 1.45, -0.6, 0.25, 0.0];
    const liftPose = [-0.45, -0.45, 1.05, -0.45, 0.2, 0.0];
    const placePose = [0.65, -0.75, 1.35, -0.5, -0.35, 0.0];

    const jointAngles = homePose.slice();
    const jointVelocities = new Array(jointAngles.length).fill(0);

    const tempVector = new THREE.Vector3();
    const tempVector2 = new THREE.Vector3();

    function applyPose(pose) {
      joints.forEach((joint, index) => {
        joint.group.rotation[joint.axis] = pose[index];
      });
    }

    function getToolWorldPosition(pose, out) {
      applyPose(pose);
      skillsScene.updateMatrixWorld(true);
      toolTip.getWorldPosition(out);
      return out;
    }

    const pickPosition = getToolWorldPosition(pickPose, new THREE.Vector3());
    const placePosition = getToolWorldPosition(placePose, new THREE.Vector3());
    applyPose(homePose);

    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.08, 0.08),
      new THREE.MeshStandardMaterial({
        color: 0xf2a15f,
        metalness: 0.2,
        roughness: 0.4,
      })
    );
    cube.position.copy(pickPosition);
    skillsScene.add(cube);

    const dropMarker = new THREE.Mesh(
      new THREE.RingGeometry(0.1, 0.16, 32),
      new THREE.MeshBasicMaterial({
        color: 0x33d1ff,
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide,
      })
    );
    dropMarker.rotation.x = -Math.PI / 2;
    dropMarker.position.copy(placePosition);
    dropMarker.position.y -= 0.06;
    skillsScene.add(dropMarker);

    const states = [
      { name: "approachPick", pose: pickPose, duration: 2.2, gripper: 1 },
      { name: "grasp", pose: pickPose, duration: 0.8, gripper: 0 },
      { name: "lift", pose: liftPose, duration: 1.4, gripper: 0 },
      { name: "moveToPlace", pose: placePose, duration: 2.4, gripper: 0 },
      { name: "release", pose: placePose, duration: 0.8, gripper: 1 },
      { name: "return", pose: homePose, duration: 2.2, gripper: 1 },
    ];

    let stateIndex = 0;
    let stateTime = 0;
    let hasCube = false;

    let gripperOpen = 1;
    let gripperVel = 0;

    function attachCube() {
      if (cube.parent !== toolTip) {
        const worldPos = tempVector.copy(cube.position);
        toolTip.add(cube);
        cube.position.set(0.03, 0, 0);
        toolTip.updateMatrixWorld(true);
      }
    }

    function detachCube() {
      if (cube.parent === toolTip) {
        cube.getWorldPosition(tempVector2);
        skillsScene.add(cube);
        cube.position.copy(tempVector2);
      }
    }

    function advanceState() {
      stateIndex = (stateIndex + 1) % states.length;
      stateTime = 0;
    }

    skillsCamera.position.set(0, 1.6, 4.6);
    skillsCamera.lookAt(0.6, 1, 0);

    let lastTime = performance.now();

    function animateSkills() {
      requestAnimationFrame(animateSkills);
      if (!prefersReducedMotion) {
        const now = performance.now();
        const dt = Math.min((now - lastTime) / 1000, 0.033);
        lastTime = now;
        const time = now * 0.001;

        pointCloud.rotation.y += 0.0015;
        pointCloud.rotation.x += 0.001;

        const currentState = states[stateIndex];
        stateTime += dt;

        if (currentState.name === "grasp" && !hasCube) {
          attachCube();
          hasCube = true;
        }

        if (currentState.name === "release" && stateTime > 0.5 && hasCube) {
          detachCube();
          cube.position.copy(placePosition);
          hasCube = false;
        }

        if (stateTime >= currentState.duration) {
          advanceState();
        }

        const targetPose = currentState.pose;
        const stiffness = 12;
        const damping = 6.5;

        joints.forEach((joint, index) => {
          const current = jointAngles[index];
          let velocity = jointVelocities[index];
          const target = targetPose[index];

          velocity += (target - current) * stiffness * dt;
          velocity *= Math.exp(-damping * dt);
          const next = current + velocity * dt;

          jointAngles[index] = next;
          jointVelocities[index] = velocity;
          joint.group.rotation[joint.axis] = next;
        });

        const targetGrip = currentState.gripper;
        gripperVel += (targetGrip - gripperOpen) * 10 * dt;
        gripperVel *= Math.exp(-6 * dt);
        gripperOpen += gripperVel * dt;
        gripperOpen = Math.min(Math.max(gripperOpen, 0), 1);

        const gap = 0.025 + gripperOpen * 0.05;
        gripperLeft.position.z = gap;
        gripperRight.position.z = -gap;

        if (hasCube) {
          const carryOffset = 0.03 + Math.sin(time * 2) * 0.002;
          cube.position.set(carryOffset, 0, 0);
        }
      }
      skillsRenderer.render(skillsScene, skillsCamera);
    }
    animateSkills();

    window.addEventListener("resize", () => {
      skillsCamera.aspect = skillsCanvas.clientWidth / skillsCanvas.clientHeight;
      skillsCamera.updateProjectionMatrix();
      skillsRenderer.setSize(
        skillsCanvas.clientWidth,
        skillsCanvas.clientHeight
      );
    });
  }
}
