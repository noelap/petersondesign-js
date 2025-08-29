<!-- Mobile Menu Toggle (Order-Proof Version) -->
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



/* Notes

  Mobile Menu Toggle (Order-Proof Version)
  ----------------------------------------
  ✅ Waits for full Webflow load before binding (covers async asset loading)
  ✅ Handles scroll lock without jump
  ✅ Works reliably whether inline or external
*/