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
  const defaultFix = document.querySelectorAll('h2:not(.widow-fix-off)');
  const forceFix = document.querySelectorAll('.widow-fix-on');
  const elements = new Set([...defaultFix, ...forceFix]);

  elements.forEach(el => {
    let text = el.innerHTML.replace(/(\w)-(\w)/g, '$1&#8209;$2');
    const words = text.trim().split(' ');

    if (words.length > 2) {
      words[words.length - 2] += '&nbsp;' + words[words.length - 1];
      words.pop();
      el.innerHTML = words.join(' ');
    }
  });
});










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

    if (body.classList.contains("menu-locked") && !body.classList.contains("menu-open")) {
      body.classList.remove("menu-locked");
      body.style.top = "";
    }
  }, 300);
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
  document.body.classList.remove("menu-open");
  document.documentElement.classList.remove("no-scroll");
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

	const wrappers = document.querySelectorAll(".video-wrapper");

	const fadeOutFallback = (fallback) => {
	  if (fallback && fallback.style.opacity !== "0") {
		fallback.style.opacity = "0";
		setTimeout(() => fallback.remove(), 600);
	  }
	};

	const handleVideoPlayback = (video, fallback, playBtn) => {
	  video.muted = true;
	  const autoplayAttempt = video.play();

	  if (autoplayAttempt !== undefined) {
		autoplayAttempt
		  .then(() => {
			fallback && (fallback.style.display = "none");
			playBtn && (playBtn.style.display = "none");
			video.style.display = "block";

			if (video.readyState >= 3) {
			  fadeOutFallback(fallback);
			} else {
			  video.addEventListener("playing", () => fadeOutFallback(fallback), { once: true });
			}
		  })
		  .catch(() => {
			video.setAttribute("controls", true);
			video.classList.add("needs-play-button");

			fallback && (fallback.style.display = "block");
			playBtn && (playBtn.style.display = "block");
			video.style.display = "none";

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

	// Observer for scroll-triggered videos
	const videoObserver = new IntersectionObserver((entries) => {
	  entries.forEach(entry => {
		if (!entry.isIntersecting) return;

		const wrapper = entry.target;
		const video = wrapper.querySelector("video");
		const fallback = wrapper.querySelector(".video-fallback-img");
		const playBtn = wrapper.querySelector(".video-play-btn");

		if (video.dataset.autoplayHandled) return;
		video.dataset.autoplayHandled = true;

		handleVideoPlayback(video, fallback, playBtn);
	  });
	}, {
	  threshold: 0.6
	});

	wrappers.forEach(wrapper => {
	  const video = wrapper.querySelector("video");
	  if (!video) return;

	  const fallback = wrapper.querySelector(".video-fallback-img");
	  const playBtn = wrapper.querySelector(".video-play-btn");

	  const isHero = video.classList.contains("video-hero");
	  const isScrollTriggered = video.classList.contains("media-item");

	  if (isHero) {
		// Special case: autoplay immediately if it's a homepage hero
		if (document.body.classList.contains("homepage")) {
		  handleVideoPlayback(video, fallback, playBtn);
		  video.dataset.autoplayHandled = true;
		} else {
		  // Default hero handling
		  handleVideoPlayback(video, fallback, playBtn);
		  video.dataset.autoplayHandled = true;
		}
	  } else if (isScrollTriggered) {
		videoObserver.observe(wrapper);
	  }
	});

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

  const observer = new IntersectionObserver((entries) => {
	entries.forEach(entry => {

	  if (entry.isIntersecting) {
		const video = entry.target;
		if (video.paused) {
		  video.play().catch(() => {});
		}

	  } else {
		entry.target.pause();
	  }

	});
  }, {
	threshold: 0.5
  });

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

  const mediaItems = document.querySelectorAll(".media-item");

  const observer = new IntersectionObserver((entries, obs) => {
	entries.forEach(entry => {
	  if (entry.isIntersecting) {
		const el = entry.target;
		el.style.transition = "opacity 0.9s cubic-bezier(0.4, 0, 0.2, 1), transform 0.9s cubic-bezier(0.4, 0, 0.2, 1)";
		el.style.opacity = "1";
		el.style.transform = "translateY(0)";
		obs.unobserve(el);
	  }
	});
  }, {
	threshold: 0.15
  });

  mediaItems.forEach(el => observer.observe(el));
});

