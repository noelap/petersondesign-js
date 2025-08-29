<!-- Fix for Mobile Overlay State on Browser Back/Forward Navigation -->
<script>
window.addEventListener("pageshow", function () {
  document.body.classList.remove("menu-open");
  document.documentElement.classList.remove("no-scroll");
});
</script>


/* Notes

  Fix for Mobile Overlay State on Browser Back/Forward Navigation
  ----------------------------------------------------------------
  This script ensures that when users navigate using the browser's back or forward buttons,
  any mobile menu overlay is properly closed by removing relevant classes:
  - `.menu-open` on <body>, which controls menu visibility
  - `.no-scroll` on <html>, which disables page scrolling during overlay

  This prevents the overlay from remaining open unexpectedly when navigating pages.
*/