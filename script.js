// Sidebar Toggle for Mobile
function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("active");
}

// Close sidebar when clicking a link (Mobile)
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 768) {
      toggleSidebar();
    }
  });
});

// Close sidebar when clicking outside (Mobile)
document.addEventListener("click", (event) => {
  const sidebar = document.getElementById("sidebar");
  const toggleBtn = document.querySelector(".mobile-toggle");

  if (
    window.innerWidth <= 768 &&
    sidebar.classList.contains("active") &&
    !sidebar.contains(event.target) &&
    !toggleBtn.contains(event.target)
  ) {
    toggleSidebar();
  }
});

// Theme Toggle
function toggleTheme() {
  const body = document.body;
  const themeIcon = document.getElementById("themeIcon");
  const themeText = document.getElementById("themeText");

  body.classList.toggle("light-mode");
  const isLight = body.classList.contains("light-mode");

  if (isLight) {
    themeIcon.className = "theme-icon sun";
    themeText.textContent = "Light Mode";
  } else {
    themeIcon.className = "theme-icon moon";
    themeText.textContent = "Dark Mode";
  }

  localStorage.setItem("theme", isLight ? "light" : "dark");
}

// Load Theme on page load
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  const themeIcon = document.getElementById("themeIcon");
  const themeText = document.getElementById("themeText");

  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
    themeIcon.className = "theme-icon sun";
    themeText.textContent = "Light Mode";
  }
});

// Scroll Progress
window.addEventListener("scroll", () => {
  const winScroll =
    document.body.scrollTop || document.documentElement.scrollTop;
  const height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  document.getElementById("progressBar").style.width = scrolled + "%";

  // Back to Top
  if (winScroll > 300) {
    document.getElementById("backToTop").classList.add("visible");
  } else {
    document.getElementById("backToTop").classList.remove("visible");
  }
});

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Toast Notification Logic
function showToast(message) {
  // Create toast element if it doesn't exist
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.className = "toast show";

  setTimeout(() => {
    toast.className = toast.className.replace("show", "");
  }, 3000);
}

// Scroll Spy Logic
function initScrollSpy() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  // Track the currently open details to manage auto-closing
  let currentOpenDetails = null;

  // Add click listener to summaries to mark them as manually toggled
  document.querySelectorAll("details summary").forEach((summary) => {
    summary.addEventListener("click", function () {
      const details = this.parentElement;
      // If user clicks, remove the auto-opened flag so we don't auto-close it
      delete details.dataset.autoOpened;

      // Also update our tracking if this was the auto-opened one
      if (currentOpenDetails === details) {
        currentOpenDetails = null;
      }
    });
  });

  const observerOptions = {
    root: null,
    rootMargin: "-20% 0px -60% 0px", // Highlight when section is near top
    threshold: 0,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Remove active class from all links
        navLinks.forEach((link) => link.classList.remove("active"));

        // Add active class to corresponding link
        const id = entry.target.getAttribute("id");
        const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);

        if (activeLink) {
          activeLink.classList.add("active");

          // Sidebar Auto-Scroll: Bring the active link into view
          activeLink.scrollIntoView({
            behavior: "smooth",
            block: "nearest", // "center" might be too jumping, nearest is safer
          });

          // Logic for Auto-Opening/Closing Details
          const parentDetails = activeLink.closest("details");

          // 1. If we have a new parent details (or none)
          if (parentDetails !== currentOpenDetails) {
            // If there was a previously auto-opened details, close it
            if (
              currentOpenDetails &&
              currentOpenDetails.dataset.autoOpened === "true"
            ) {
              currentOpenDetails.open = false;
              delete currentOpenDetails.dataset.autoOpened;
            }

            // 2. Open the new parent details if it exists and is closed
            if (parentDetails && !parentDetails.open) {
              parentDetails.open = true;
              parentDetails.dataset.autoOpened = "true";
              currentOpenDetails = parentDetails;
            } else if (parentDetails && parentDetails.open) {
              // If it's already open (manually or otherwise), track it but don't mark as auto-opened
              // effectively "adopting" it as the current context, but respecting manual state
              // checks if it WAS auto-opened before
              if (parentDetails.dataset.autoOpened === "true") {
                currentOpenDetails = parentDetails;
              } else {
                // Manually open, so we don't track it for auto-closing
                currentOpenDetails = null;
              }
            } else {
              currentOpenDetails = null;
            }
          }
        }
      }
    });
  }, observerOptions);

  sections.forEach((section) => {
    observer.observe(section);
  });
}

// Sidebar Search Logic
function initSearch() {
  const sidebarHeader = document.querySelector(".sidebar-header");
  if (!sidebarHeader) return;

  // Check if search already exists to prevent duplicates
  if (document.querySelector(".sidebar-search")) return;

  const searchContainer = document.createElement("div");
  searchContainer.className = "sidebar-search";

  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "/ to search topics...";
  searchInput.className = "search-input";

  searchContainer.appendChild(searchInput);
  sidebarHeader.after(searchContainer);

  const navLinks = document.querySelectorAll(".sidebar .nav-link");
  const details = document.querySelectorAll(".sidebar details");

  searchInput.addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase();

    navLinks.forEach((link) => {
      const text = link.textContent.toLowerCase();
      // Skip the "Back to Home" link from being hidden
      if (link.href.includes("index.html")) return;

      if (text.includes(term)) {
        link.style.display = "block";
        // Ensure parent details is open
        const parent = link.closest("details");
        if (parent) parent.open = true;
      } else {
        link.style.display = "none";
      }
    });

    // If search is empty, restore state (optional: could close all, but leaving open is fine)
    if (term === "") {
      navLinks.forEach((link) => (link.style.display = "block"));
    }
  });
}

// Copy Code Logic
function initCopyButtons() {
  document.querySelectorAll("pre").forEach((pre) => {
    // Wrap pre in a container for positioning
    const container = document.createElement("div");
    container.className = "code-container";
    pre.parentNode.insertBefore(container, pre);
    container.appendChild(pre);

    const btn = document.createElement("button");
    btn.className = "copy-btn";
    btn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy';

    btn.addEventListener("click", () => {
      const code = pre.querySelector("code").innerText;
      navigator.clipboard.writeText(code).then(() => {
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
        setTimeout(() => {
          btn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy';
        }, 2000);
      });
    });

    container.appendChild(btn);
  });
}

// Search Shortcut
function initSearchShortcut() {
  document.addEventListener("keydown", (e) => {
    // Press '/' to search (ensure not typing in an input)
    if (
      e.key === "/" &&
      document.activeElement.tagName !== "INPUT" &&
      document.activeElement.tagName !== "TEXTAREA"
    ) {
      e.preventDefault();
      const searchInput = document.querySelector(".search-input");
      if (searchInput) {
        searchInput.focus();
      }
    }
  });
}

// Syntax Highlighting Initialization
function initSyntaxHighlighting() {
  document.querySelectorAll("pre code").forEach((codeBlock) => {
    // If no language class is present, default to language-java
    if (!codeBlock.className.includes("language-")) {
      codeBlock.classList.add("language-java");
    }
  });
  // Trigger Prism highlight if available
  if (window.Prism) {
    Prism.highlightAll();
  }
}

// Floating Contextual Buttons System
function initFloatingButtons() {
  // Create floating buttons container
  const floatingContainer = document.createElement("div");
  floatingContainer.id = "floating-buttons";
  floatingContainer.className = "floating-buttons";
  document.body.appendChild(floatingContainer);

  // Track current section and its buttons
  let currentSection = null;
  const buttonMap = new Map(); // Maps section ID to button elements

  // Find all sections with contextual content
  const sections = document.querySelectorAll("section[id]");

  sections.forEach((section) => {
    const sectionId = section.getAttribute("id");
    const warningBoxes = section.querySelectorAll(".warning-box");
    const tryItBoxes = section.querySelectorAll(".try-it-box");
    const infoBoxes = section.querySelectorAll(".info-box");

    const buttons = [];

    // Create warning button if warning boxes exist
    if (warningBoxes.length > 0) {
      warningBoxes.forEach((box, index) => {
        box.setAttribute("data-floating", "true");
        box.setAttribute("data-content-id", `${sectionId}-warning-${index}`);
      });

      const warningBtn = createFloatingButton("warning", "⚠️ Warning", () => {
        toggleContent(sectionId, "warning-box");
      });
      buttons.push(warningBtn);
    }

    // Create try-it button if try-it boxes exist
    if (tryItBoxes.length > 0) {
      tryItBoxes.forEach((box, index) => {
        box.setAttribute("data-floating", "true");
        box.setAttribute("data-content-id", `${sectionId}-tryit-${index}`);
      });

      const tryItBtn = createFloatingButton("tryit", "🔧 Try It", () => {
        toggleContent(sectionId, "try-it-box");
      });
      buttons.push(tryItBtn);
    }

    // Create info button if info boxes exist (excluding diagrams)
    if (infoBoxes.length > 0) {
      const nonDiagramInfoBoxes = Array.from(infoBoxes).filter(
        (box) => !box.classList.contains("mermaid-diagram")
      );

      if (nonDiagramInfoBoxes.length > 0) {
        nonDiagramInfoBoxes.forEach((box, index) => {
          box.setAttribute("data-floating", "true");
          box.setAttribute("data-content-id", `${sectionId}-info-${index}`);
        });

        const infoBtn = createFloatingButton("info", "ℹ️ Info", () => {
          toggleContent(sectionId, "info-box");
        });
        buttons.push(infoBtn);
      }
    }

    if (buttons.length > 0) {
      buttonMap.set(sectionId, buttons);
    }
  });

  // Helper function to create a floating button
  function createFloatingButton(type, tooltip, onClick) {
    const btn = document.createElement("button");
    btn.className = `float-btn ${type}-btn`;
    btn.setAttribute("data-tooltip", tooltip);
    btn.setAttribute("data-type", type);

    const icon = document.createElement("i");
    if (type === "warning") {
      icon.className = "fa-solid fa-triangle-exclamation";
    } else if (type === "tryit") {
      icon.className = "fa-solid fa-flask";
    } else if (type === "info") {
      icon.className = "fa-solid fa-circle-info";
    }

    btn.appendChild(icon);
    btn.addEventListener("click", onClick);

    return btn;
  }

  // Helper function to toggle content visibility
  function toggleContent(sectionId, contentClass) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const contentBoxes = section.querySelectorAll(
      `.${contentClass}[data-floating="true"]`
    );

    contentBoxes.forEach((box) => {
      if (box.classList.contains("revealed")) {
        box.classList.remove("revealed");
        // Scroll to section top when hiding
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        box.classList.add("revealed");
        // Scroll to the revealed content
        setTimeout(() => {
          box.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 100);
      }
    });
  }

  // Intersection Observer to show/hide buttons based on section visibility
  const observerOptions = {
    root: null,
    rootMargin: "-10% 0px -10% 0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const sectionId = entry.target.getAttribute("id");
      const buttons = buttonMap.get(sectionId);

      if (entry.isIntersecting && buttons) {
        // Section is visible, show its buttons
        if (currentSection !== sectionId) {
          // Clear previous buttons
          floatingContainer.innerHTML = "";

          // Add new buttons
          buttons.forEach((btn) => {
            floatingContainer.appendChild(btn);
          });

          // Show container
          setTimeout(() => {
            floatingContainer.classList.add("visible");
          }, 50);

          currentSection = sectionId;
        }
      } else if (currentSection === sectionId && !entry.isIntersecting) {
        // Section left viewport, hide buttons
        floatingContainer.classList.remove("visible");
        setTimeout(() => {
          if (!floatingContainer.classList.contains("visible")) {
            floatingContainer.innerHTML = "";
            currentSection = null;
          }
        }, 400);
      }
    });
  }, observerOptions);

  // Observe all sections that have buttons
  sections.forEach((section) => {
    const sectionId = section.getAttribute("id");
    if (buttonMap.has(sectionId)) {
      observer.observe(section);
    }
  });
}

// Horizontal Scroll Logic for Code Blocks and Tables
function initHorizontalScroll() {
  const scrollables = document.querySelectorAll(".table-container, pre");

  scrollables.forEach((el) => {
    el.addEventListener(
      "wheel",
      (e) => {
        // Only hijack if vertical scroll (deltaY) is present
        if (e.deltaY === 0) return;

        // check if content actually overflows horizontally
        if (el.scrollWidth > el.clientWidth) {
          // Calculate potential new position
          const atLeft = el.scrollLeft === 0;
          const atRight =
            Math.abs(el.scrollWidth - el.clientWidth - el.scrollLeft) < 1;

          // Only prevent default if we are scrolling IN the direction that has space
          // This allows standard vertical page scrolling when the user hits the edge
          if ((e.deltaY < 0 && !atLeft) || (e.deltaY > 0 && !atRight)) {
            e.preventDefault();
            el.scrollLeft += e.deltaY;
          }
        }
      },
      { passive: false }
    );
  });
}

// Initialize floating buttons after DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const comingSoonElements = document.querySelectorAll(".card-coming-soon");
  comingSoonElements.forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      showToast("🚧 Guide coming soon! Stay tuned.");
    });
  });

  initScrollSpy();
  initSearch();
  initCopyButtons();
  initSearchShortcut();
  initSyntaxHighlighting();
  initHorizontalScroll(); // Initialize horizontal scrolling
  initSyntaxHighlighting();
  initHorizontalScroll(); // Initialize horizontal scrolling
});
