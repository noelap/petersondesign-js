/* --------------------------------------------------
   Mobile Menu Overlay Scripts
   -------------------------------------------------- */

/*
  Mobile Menu Toggle (Order-Proof Version)
  ----------------------------------------
  ✅ Waits for full Webflow load before binding (covers async asset loading)
  ✅ Handles scroll lock without jump
  ✅ Works reliably whether inline or external
*/

<script>
(function () {
  function initMenu() {
    const toggle = document.getElementById("menu-trigger");
    if (!toggle) return;

    const body = document.body;
    let scrollPosition = 0;

    function openMenu() {
      scrollPosition = window.scrollY;
      body.style.top = `-${scrollPosition}px`;
      body.classList.add("menu-open", "menu-locked");
    }

    function closeMenu() {
      body.classList.add("menu-closing");
      body.classList.remove("menu-open", "menu-locked");
      body.style.top = "";
      window.scrollTo(0, scrollPosition);

      setTimeout(() => {
        body.classList.remove("menu-closing");
      }, 400);
    }

    function closeMenuOnResize() {
      if (window.innerWidth >= 992 && body.classList.contains("menu-open")) {
        closeMenu();
      }
    }

    toggle.addEventListener("click", function () {
      if (body.classList.contains("menu-open")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    window.addEventListener("resize", closeMenuOnResize);
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (window.Webflow && typeof window.Webflow.push === "function") {
      window.Webflow.push(initMenu);
    } else {
      initMenu();
    }
  });
})();
</script>



/*
  Debug Fix for Menu Scroll Lock after Page Load
  --------------------------------------------------
  This script is intended for manual debugging: when you add the `.debug` class
  to the `<body>` in Webflow, it allows you to see and interact with the menu overlay
  to make edits. Once done, remove the `.debug` class.

  The script runs after full page load and checks for a stuck scroll lock state,
  where `.menu-locked` remains but `.menu-open` was removed prematurely by the loader fade.
  It then removes the scroll lock and resets the body top offset to restore normal scrolling.
  The 300ms delay allows Webflow's page load interactions (IX) to finish first.
*/

<script>
window.addEventListener("load", function () {
  setTimeout(() => {
    const body = document.body;

    if (body.classList.contains("menu-locked") && !body.classList.contains("menu-open")) {
      body.classList.remove("menu-locked");
      body.style.top = "";
    }
  }, 300);
});
</script>


/*
  Fix for Mobile Overlay State on Browser Back/Forward Navigation
  ----------------------------------------------------------------
  This script ensures that when users navigate using the browser's back or forward buttons,
  any mobile menu overlay is properly closed by removing relevant classes:
  - `.menu-open` on <body>, which controls menu visibility
  - `.no-scroll` on <html>, which disables page scrolling during overlay

  This prevents the overlay from remaining open unexpectedly when navigating pages.
*/

<script>
window.addEventListener("pageshow", function () {
  document.body.classList.remove("menu-open");
  document.documentElement.classList.remove("no-scroll");
});
</script>