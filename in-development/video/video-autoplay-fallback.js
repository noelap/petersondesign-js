<!-- Video 1: Autoplay with Fallback and Custom Play Button -->
<script>
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
			// Autoplay failed
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
</script>