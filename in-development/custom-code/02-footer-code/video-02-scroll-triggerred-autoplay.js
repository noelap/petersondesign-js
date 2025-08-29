<!-- Video 2: Scroll-triggered video autoplay -->
<script>
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
</script>



/* Notes

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