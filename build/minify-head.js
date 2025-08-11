// build/minify-head.js
const fs = require('fs').promises;
const path = require('path');
const { minify } = require('terser');

(async () => {
  try {
    const src = path.join(__dirname, '..', 'in-development', 'head-code.js');
    const out = path.join(__dirname, '..', 'in-production', 'head-code.min.js');

    // Read source
    let code = await fs.readFile(src, 'utf8');

    // Remove any <script> tags (if you keep them in the dev file for clarity)
    code = code.replace(/<\s*\/?script\b[^>]*>/gi, '');

    // Minify with terser
    const result = await minify(code, {
      compress: true,
      mangle: true,
      format: {
        comments: false // remove all comments in production
      }
    });

    if (!result || typeof result.code !== 'string') {
      throw new Error('Terser returned no code');
    }

    // Ensure output folder exists and write file
    await fs.mkdir(path.dirname(out), { recursive: true });
    await fs.writeFile(out, result.code, 'utf8');

    console.log(`Minified: ${src} → ${out}`);
  } catch (err) {
    console.error('Minify error:', err);
    process.exitCode = 1;
  }
})();