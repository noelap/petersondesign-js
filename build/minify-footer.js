// build/minify-footer.js
const fs = require('fs').promises;
const path = require('path');
const { minify } = require('terser');

(async () => {
  try {
	const src = path.join(__dirname, '..', 'in-development', 'footer-code.js');
	const out = path.join(__dirname, '..', 'in-production', 'footer-code.min.js');

	// read source
	let code = await fs.readFile(src, 'utf8');

	// remove any <script> or </script> tags (case-insensitive)
	code = code.replace(/<\s*\/?script\b[^>]*>/gi, '');

	// minify with terser
	const result = await minify(code, {
	  compress: true,
	  mangle: true,
	  format: {
		comments: false // change if you want to preserve special comments
	  }
	});

	if (!result || typeof result.code !== 'string') {
	  throw new Error('Terser returned no code');
	}

	// ensure output folder exists
	await fs.mkdir(path.dirname(out), { recursive: true });

	// write minified file
	await fs.writeFile(out, result.code, 'utf8');

	console.log('Minified footer-code.js → in-production/footer-code.min.js');
  } catch (err) {
	console.error('Minify error:', err);
	process.exitCode = 1;
  }
})();