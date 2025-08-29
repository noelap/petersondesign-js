<!-- Text Widows Fix Script -->
<script>
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
</script>



/* Notes

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