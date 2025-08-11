/* --------------------------------------------------
   Typography Scripts
   -------------------------------------------------- */

/*
Text Widows Fix Script
----------------------
Purpose:
- Automatically prevent widows (single words on the last line) in headings.
- By default, applies to all <h2> elements except those with the class `.widow-fix-off`.
- Also applies to any element with the class `.widow-fix-on` regardless of tag.
- Replaces hyphens with non-breaking hyphens to avoid breaks there.
- Joins the last two words with a non-breaking space to keep them together.

Usage:
- Add `.widow-fix-off` to any <h2> to exclude from default processing.
- Add `.widow-fix-on` to any element to force the fix there.
*/


document.addEventListener("DOMContentLoaded", function () {
// Select all h2 elements without the widow-fix-off class (default targets)
const defaultFix = document.querySelectorAll('h2:not(.widow-fix-off)');

// Select any element with widow-fix-on class (forced targets)
const forceFix = document.querySelectorAll('.widow-fix-on');

// Combine both sets into one to avoid duplicates
const elements = new Set([...defaultFix, ...forceFix]);

// Loop through each element to apply the widow fix
elements.forEach(el => {
  // Replace hyphens surrounded by word characters with non-breaking hyphens
  // This prevents line breaks at hyphens
  let text = el.innerHTML.replace(/(\w)-(\w)/g, '$1&#8209;$2');

  // Split the text into words by spaces
  const words = text.trim().split(' ');

  // Only apply fix if there are more than two words
  if (words.length > 2) {
	// Join the last two words with a non-breaking space (&nbsp;)
	words[words.length - 2] += '&nbsp;' + words[words.length - 1];
	words.pop(); // Remove the last word, now merged with the previous

	// Update the element's innerHTML with the new text
	el.innerHTML = words.join(' ');
  }
});
});










/* --------------------------------------------------
   Mobile Menu Scripts
   -------------------------------------------------- */




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

window.addEventListener("load", function () {
  setTimeout(() => {
	const body = document.body;

	// Check if scroll lock remains but menu is closed
	if (body.classList.contains("menu-locked") && !body.classList.contains("menu-open")) {
	  body.classList.remove("menu-locked");  // Remove scroll lock class
	  body.style.top = "";                    // Reset top style to allow scrolling

	  // Optional: scroll back to top or last position (commented out)
	  // window.scrollTo(0, 0);
	}
  }, 300); // Delay to ensure Webflow page load animations are complete
});


/*
  Fix for Mobile Overlay State on Browser Back/Forward Navigation
  ----------------------------------------------------------------
  This script ensures that when users navigate using the browser's back or forward buttons,
  any mobile menu overlay is properly closed by removing relevant classes:
  - `.menu-open` on <body>, which controls menu visibility
  - `.no-scroll` on <html>, which disables page scrolling during overlay

  This prevents the overlay from remaining open unexpectedly when navigating pages.
*/

window.addEventListener("pageshow", function () {
  document.body.classList.remove("menu-open");      // Close mobile menu overlay
  document.documentElement.classList.remove("no-scroll"); // Re-enable page scrolling
});










/* --------------------------------------------------
   Video Scripts
   -------------------------------------------------- */

  /*
	Video Autoplay Script
	---------------------
	Purpose:
	- Automatically plays videos on page load or when scrolled into view.
	- Handles cases where autoplay is blocked (e.g., low power mode, browser restrictions) by showing a fallback image and custom play button.
	- Supports two scenarios:
	  1. "Hero" videos (always attempt autoplay immediately).
	  2. Scroll-triggered videos (play when in viewport).
	- Removes fallback image smoothly once the video is playing.
	- Resets certain videos on page load to start from the beginning.

	Key HTML class expectations:
	- .video-wrapper → wrapper element around video
	- .video-fallback-img → fallback image for when autoplay fails
	- .video-play-btn → custom play button for manual playback
	- .video-hero → class for videos that autoplay immediately
	- .media-item → class for scroll-triggered videos
	- .reset-on-load → class for videos that should reset to 0 on page load
  */

  document.addEventListener("DOMContentLoaded", function () {

	// Select all video wrapper elements
	const wrappers = document.querySelectorAll(".video-wrapper");

	// Fade out and remove fallback image
	const fadeOutFallback = (fallback) => {
	  if (fallback && fallback.style.opacity !== "0") {
		fallback.style.opacity = "0";
		setTimeout(() => fallback.remove(), 600); // Remove after fade-out
	  }
	};

	// Main function to handle video playback attempts
	const handleVideoPlayback = (video, fallback, playBtn) => {
	  video.muted = true; // Mute to allow autoplay in most browsers
	  const autoplayAttempt = video.play();

	  if (autoplayAttempt !== undefined) {
		autoplayAttempt
		  .then(() => {
			// Autoplay succeeded
			fallback && (fallback.style.display = "none");
			playBtn && (playBtn.style.display = "none");
			video.style.display = "block";

			// Fade out fallback once video is playing
			if (video.readyState >= 3) {
			  fadeOutFallback(fallback);
			} else {
			  video.addEventListener("playing", () => fadeOutFallback(fallback), { once: true });
			}
		  })
		  .catch(() => {
			// Autoplay failed — set up manual play option
			video.setAttribute("controls", true);
			video.classList.add("needs-play-button");

			fallback && (fallback.style.display = "block");
			playBtn && (playBtn.style.display = "block");
			video.style.display = "none";

			// On play button click, show video and hide fallback
			playBtn?.addEventListener("click", () => {
			  video.style.display = "block";
			  fallback && (fallback.style.display = "none");
			  playBtn.style.display = "none";

			  video.removeAttribute("controls");
			  video.controls = false;

			  video.play();
			}, { once: true });
		  });
	  }
	};

	// Observer to autoplay videos when they come into view
	const videoObserver = new IntersectionObserver((entries) => {
	  entries.forEach(entry => {
		if (!entry.isIntersecting) return;

		const wrapper = entry.target;
		const video = wrapper.querySelector("video");
		const fallback = wrapper.querySelector(".video-fallback-img");
		const playBtn = wrapper.querySelector(".video-play-btn");

		// Prevent handling same video twice
		if (video.dataset.autoplayHandled) return;
		video.dataset.autoplayHandled = true;

		handleVideoPlayback(video, fallback, playBtn);
	  });
	}, {
	  threshold: 0.6 // At least 60% in view to trigger autoplay
	});

	// Loop over each video wrapper
	wrappers.forEach(wrapper => {
	  const video = wrapper.querySelector("video");
	  if (!video) return;

	  const fallback = wrapper.querySelector(".video-fallback-img");
	  const playBtn = wrapper.querySelector(".video-play-btn");

	  const isHero = video.classList.contains("video-hero"); // Always play immediately
	  const isScrollTriggered = video.classList.contains("media-item"); // Play when in view

	  if (isHero) {
		handleVideoPlayback(video, fallback, playBtn);
		video.dataset.autoplayHandled = true;
	  } else if (isScrollTriggered) {
		videoObserver.observe(wrapper);
	  }
	});

	// Resets specific videos on full page load (avoids resuming from last position)
	function resetVideosOnPageLoad() {
	  const navigationType = performance.getEntriesByType('navigation')[0]?.type;
	  if (navigationType !== 'back_forward') {
		document.querySelectorAll('video.reset-on-load').forEach(video => {
		  video.pause();
		  video.currentTime = 0;
		});
	  }
	}

	resetVideosOnPageLoad();
  });


/*
  Video 2: Scroll-triggered video autoplay
  ----------------------------------------
  This script automatically plays a video when it enters the viewport
  (based on an IntersectionObserver with a 50% threshold) and pauses
  it when it leaves view.

  How it works:
  - Waits for the DOM to fully load.
  - Sets up an IntersectionObserver to monitor all videos with the
	`play-on-scroll` class.
  - When a video is at least 50% visible in the viewport, it attempts
	to play.
  - If it leaves that threshold, it pauses.
  - Includes a catch block for autoplay failures (e.g., browser policy).
*/

document.addEventListener("DOMContentLoaded", function () {

  /* Create the IntersectionObserver with a 50% visibility threshold */
  const observer = new IntersectionObserver((entries) => {
	entries.forEach(entry => {

	  if (entry.isIntersecting) {
		/* Video is in view — attempt to play */
		const video = entry.target;
		if (video.paused) {
		  video.play().catch(() => {
			/* Autoplay may fail — optional fallback could be added here */
		  });
		}

	  } else {
		/* Video is out of view — pause playback */
		entry.target.pause();
	  }

	});
  }, {
	threshold: 0.5 // Trigger when 50% of the video is visible
  });

  /* Find all videos that should play on scroll and observe them */
  const scrollVideos = document.querySelectorAll("video.play-on-scroll");
  scrollVideos.forEach(video => observer.observe(video));

});


/*
  Video 3: Fade in on scroll
  --------------------------------------------------
  This script applies a smooth fade-and-slide-in effect to elements with the
  `.media-item` class when they enter the viewport. It uses the
  IntersectionObserver API to trigger the animation only once per element.
*/

document.addEventListener("DOMContentLoaded", () => {
  
  /* Select all elements with the .media-item class */
  const mediaItems = document.querySelectorAll(".media-item");

  /* 
	Create an IntersectionObserver to watch when elements
	cross into the viewport.
  */
  const observer = new IntersectionObserver((entries, obs) => {
	entries.forEach(entry => {
	  /* If the element is visible enough to trigger */
	  if (entry.isIntersecting) {
		const el = entry.target;
		
		/* Apply transition styles for fade + upward slide */
		el.style.transition = "opacity 0.9s cubic-bezier(0.4, 0, 0.2, 1), transform 0.9s cubic-bezier(0.4, 0, 0.2, 1)";
		
		/* Make element fully visible */
		el.style.opacity = "1";
		
		/* Reset vertical position (slide into place) */
		el.style.transform = "translateY(0)";
		
		/* Stop observing once animation has been triggered */
		obs.unobserve(el);
	  }
	});
  }, {
	/* Trigger when at least 15% of element is in view */
	threshold: 0.15
  });

  /* Start observing each .media-item element */
  mediaItems.forEach(el => observer.observe(el));
});