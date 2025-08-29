<!-- Debug Fix for Menu Scroll Lock after Page Load -->
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



/* Notes

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