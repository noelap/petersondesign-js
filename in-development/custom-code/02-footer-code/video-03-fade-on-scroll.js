
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

	  // Force preload for hero videos so iOS doesn’t get stuck
	  if (video.classList.contains("video-hero")) {
		video.setAttribute("playsinline", "true");
		video.setAttribute("preload", "auto");
	  }

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
		// Kick autoplay immediately on load
		handleVideoPlayback(video, fallback, playBtn);
		video.dataset.autoplayHandled = true;
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

