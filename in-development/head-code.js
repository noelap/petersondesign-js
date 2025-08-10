/**
 * Head Code: Flicker Prevention Script
 * ------------------------------------
 * After the DOM is ready, this script sets the html element’s opacity and visibility
 * back to visible with a tiny delay to ensure the page renders smoothly without flicker.
 * 
 * It also removes the `.wf-loading` class from the <html> element once the page is ready.
 * This is important because Webflow adds this class during page load to help control visibility.
 */

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
	// Make the page visible after a short delay
	document.documentElement.style.opacity = "1";
	document.documentElement.style.visibility = "visible";

	// Remove the Webflow loading class to signal page load completion
	document.documentElement.classList.remove("wf-loading");
  }, 50);
});