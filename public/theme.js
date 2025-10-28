// theme.js (robust, ready-to-use)
// Put <script src="theme.js"></script> just before </body> OR in <head> (this script waits for DOMContentLoaded)

(function () {
  const root = document.documentElement; // <html>
  let themeToggle;

  // Safe DOM ready
  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  // Update the toggle icon (expects <button class="theme-toggle"><i class="..."></i></button>)
  function updateIcon(theme) {
    if (!themeToggle) return;
    const icon = themeToggle.querySelector("i");
    if (!icon) return;
    // set class names to FontAwesome sun/moon (adjust if you're using a different icon set)
    icon.className = theme === "dark" ? "fas fa-sun" : "fas fa-moon";
  }

  // Apply theme to <html> and store preference
  function applyTheme(theme, persist = true) {
    root.setAttribute("data-theme", theme);
    if (persist) localStorage.setItem("theme", theme);
    updateIcon(theme);
  }

  // Decide initial theme: saved > system > light
  function getInitialTheme() {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;

    // fallback to system preference
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  }

  // Toggle handler
  function toggleTheme() {
    const current = root.getAttribute("data-theme") || "light";
    const next = current === "light" ? "dark" : "light";
    applyTheme(next);
  }

  // Listen to system changes (only if user hasn't explicitly saved a preference)
  function setupSystemListener() {
    if (!window.matchMedia) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener?.("change", (e) => {
      // Only follow system if user didn't set a stored preference
      if (!localStorage.getItem("theme")) {
        applyTheme(e.matches ? "dark" : "light", false);
      }
    });
  }

  // Init once DOM is ready
  onReady(() => {
    themeToggle = document.querySelector(".theme-toggle");

    // If toggle button not found, don't crash—log a helpful message
    if (!themeToggle) {
      console.warn('theme.js: .theme-toggle button not found. Add <button class="theme-toggle"><i class="fas fa-moon"></i></button> to your HTML.');
    } else {
      themeToggle.addEventListener("click", toggleTheme);
    }

    applyTheme(getInitialTheme(), false);
    setupSystemListener();
  });
})();
