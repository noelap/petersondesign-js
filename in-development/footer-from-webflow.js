<!-- Code via GitHub -->
<script src="https://cdn.jsdelivr.net/gh/noelap/petersondesign-js@main/in-production/test-script.min.js"></script>

<script src="https://cdn.jsdelivr.net/gh/noelap/petersondesign-js@main/in-production/video/video-autoplay-fallback.min.js"></script>



<!-- Toggle .menu-open class on <body> and lock scroll without snapping -->
<script>
  document.addEventListener("DOMContentLoaded", function () {
	const toggle = document.getElementById("menu-trigger");
	const body = document.body;
	const html = document.documentElement;
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
	  }, 400); // Match your overlay transition duration
	}

	function closeMenuOnResize() {
	  if (window.innerWidth >= 992 && body.classList.contains("menu-open")) {
		closeMenu();
	  }
	}

	toggle?.addEventListener("click", function () {
	  if (body.classList.contains("menu-open")) {
		closeMenu();
	  } else {
		openMenu();
	  }
	});

	window.addEventListener("resize", closeMenuOnResize);
  });
</script>


<!-- Debug menu open but page load incomplete -->
<script>
  window.addEventListener("load", function () {
	setTimeout(() => {
	  const body = document.body;

	  // If menu-lock is still on but menu-open was removed by the loader fade
	  if (body.classList.contains("menu-locked") && !body.classList.contains("menu-open")) {
		body.classList.remove("menu-locked");
		body.style.top = "";

		// Optional: scroll back to previous position or just do nothing
		// window.scrollTo(0, 0);
	  }
	}, 300); // 300ms gives time for Webflow's page load IX to finish
  });
</script>


<!-- Ensure the mobile overlay doesn’t remain open when using Back/Forward buttons -->
<script>
  window.addEventListener("pageshow", function () {
	document.body.classList.remove("menu-open");
	document.documentElement.classList.remove("no-scroll");
  });
</script>


<!-- Text widows [Applied by default to h2. Can be turned off and on, on any text, using CSS] -->
<script>
  document.addEventListener("DOMContentLoaded", function () {
	// Apply by default to all h2s
	const defaultFix = document.querySelectorAll('h2:not(.widow-fix-off)');
	// Force apply to any element with 'widow-fix-on'
	const forceFix = document.querySelectorAll('.widow-fix-on');

	// Combine into a Set to avoid duplicates
	const elements = new Set([...defaultFix, ...forceFix]);

	elements.forEach(el => {
	  // Replace hyphens with non-breaking hyphens
	  let text = el.innerHTML.replace(/(\w)-(\w)/g, '$1&#8209;$2');

	  // Apply widow fix (join last two words)
	  const words = text.trim().split(' ');
	  if (words.length > 2) {
		words[words.length - 2] += '&nbsp;' + words[words.length - 1];
		words.pop();
		el.innerHTML = words.join(' ');
	  }
	});
  });
</script>



<!-- Video 2: Scroll-triggered video autoplay -->
<script>
  document.addEventListener("DOMContentLoaded", function () {
	const observer = new IntersectionObserver((entries) => {
	  entries.forEach(entry => {
		if (entry.isIntersecting) {
		  const video = entry.target;
		  if (video.paused) {
			video.play().catch(() => {
			  // Autoplay may fail — optionally handle fallback here
			});
		  }
		} else {
		  // Pause when out of view
		  entry.target.pause();
		}
	  });
	}, {
	  threshold: 0.5
	});

	const scrollVideos = document.querySelectorAll("video.play-on-scroll");
	scrollVideos.forEach(video => observer.observe(video));
  });
</script>



<!-- Video 3: Fade in on scroll -->
<script>
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
</script>