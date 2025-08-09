<script>
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
</script>