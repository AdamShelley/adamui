const fs = require('fs');
const path = require('path');
const tailwindcss = require('tailwindcss');
const postcss = require('postcss');

// Ensure the dist directory exists
const distDir = path.join(__dirname, '../dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Create a minimal CSS file with @tailwind directives
const cssContent = `
@tailwind base;
@tailwind components;
@tailwind utilities;
`;

// Process the CSS with Tailwind
postcss([
  tailwindcss(path.join(__dirname, '../tailwind.config.js')),
])
  .process(cssContent, { from: undefined })
  .then((result) => {
    fs.writeFileSync(path.join(distDir, 'index.css'), result.css);
    console.log('CSS built successfully! ✨');
  })
  .catch((error) => {
    console.error('Error building CSS:', error);
    process.exit(1);
  });