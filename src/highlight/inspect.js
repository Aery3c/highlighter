'use strict';

/**
 *
 * @param {Highlight} highlight
 */
export default function inspect (highlight) {
  const characterRange = highlight.characterRange;
  const range = characterRange.toRange(), characterText = range.toString();

  console.log('{');
  console.log('  commonAncestor:', range.commonAncestorContainer);
  console.log(`  characterText: %c${characterText}`, consoleStyle);
  console.log(`  characterRange: { start: ${characterRange.start}, end: ${characterRange.end} }`);
  console.log(`  applied:`, highlight.applied);
  console.log('}');
}

const consoleStyle = [
  'background: rgb(254, 232, 195)',
  'color: rgb(51, 51, 51)',
  'border: 1px solid #ccc',
  'border-radius: 4px',
  'padding: 2px'
].join(';');