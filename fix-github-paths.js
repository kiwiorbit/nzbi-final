/**
 * Script to fix paths for GitHub Pages deployment
 *
 * This script replaces absolute paths with relative paths in all HTML, CSS, and JS files
 * to ensure compatibility with GitHub Pages.
 */

const fs = require('fs');
const path = require('path');

// Get the repository name from package.json or set it manually
let repoName = 'nzbiv2';
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  repoName = packageJson.name || 'nzbiv2';
} catch (error) {
  // If package.json doesn't exist or doesn't have a name field
  // We'll use the default value set above
  console.log('Using default repository name: ' + repoName);
}

// Get all HTML, CSS, and JS files
const htmlFiles = fs.readdirSync('.').filter(file => file.endsWith('.html'));
const cssFiles = fs.readdirSync('.').filter(file => file.endsWith('.css'));
const jsFiles = fs.readdirSync('.').filter(file => file.endsWith('.js') && !file.includes('fix-github-paths.js'));
const manifestFile = 'manifest.json';

// Function to fix paths in HTML files
function fixPathsInHtmlFile(filePath) {
  console.log(`Fixing paths in ${filePath}...`);

  let content = fs.readFileSync(filePath, 'utf8');

  // Fix paths in href and src attributes
  content = content.replace(/href="\//g, `href="./`);
  content = content.replace(/src="\//g, `src="./`);

  // Fix canonical URLs and Open Graph URLs
  content = content.replace(/(content|href)="https:\/\/nzbi\.com\//g, `$1="https://yourusername.github.io/${repoName}/`);

  // Fix service worker registration path
  content = content.replace(/navigator\.serviceWorker\.register\('\/service-worker\.js'/g, `navigator.serviceWorker.register('./service-worker.js'`);

  // Write the fixed content back to the file
  fs.writeFileSync(filePath, content);
  console.log(`Fixed paths in ${filePath}`);
}

// Function to fix paths in CSS files
function fixPathsInCssFile(filePath) {
  console.log(`Fixing paths in ${filePath}...`);

  let content = fs.readFileSync(filePath, 'utf8');

  // Fix url() paths in CSS
  content = content.replace(/url\(\/(?!http)/g, `url(./`);

  // Fix @import paths
  content = content.replace(/@import\s+['"]\/(?!http)/g, `@import './`);

  // Fix font-face src paths
  content = content.replace(/src:\s+url\(['"]\/(?!http)/g, `src: url('./`);

  // Write the fixed content back to the file
  fs.writeFileSync(filePath, content);
  console.log(`Fixed paths in ${filePath}`);
}

// Function to fix paths in JS files
function fixPathsInJsFile(filePath) {
  console.log(`Fixing paths in ${filePath}...`);

  let content = fs.readFileSync(filePath, 'utf8');

  // Fix paths in fetch() calls
  content = content.replace(/fetch\(['"]\/(?!http)/g, `fetch('./`);

  // Fix paths in service worker registration
  content = content.replace(/navigator\.serviceWorker\.register\(['"]\/(?!http)/g, `navigator.serviceWorker.register('./`);

  // Fix paths in service worker cache
  if (filePath === 'service-worker.js') {
    content = content.replace(/['"]\/(?!http)/g, `'./`);
  }

  // Write the fixed content back to the file
  fs.writeFileSync(filePath, content);
  console.log(`Fixed paths in ${filePath}`);
}

// Function to fix paths in manifest.json
function fixPathsInManifest() {
  if (!fs.existsSync(manifestFile)) return;

  console.log(`Fixing paths in ${manifestFile}...`);

  let content = fs.readFileSync(manifestFile, 'utf8');
  let manifest = JSON.parse(content);

  // Fix start_url
  if (manifest.start_url && manifest.start_url.startsWith('/')) {
    manifest.start_url = '.' + manifest.start_url;
  }

  // Fix icon paths
  if (manifest.icons && Array.isArray(manifest.icons)) {
    manifest.icons.forEach(icon => {
      if (icon.src && icon.src.startsWith('/')) {
        icon.src = '.' + icon.src;
      }
    });
  }

  // Write the fixed content back to the file
  fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2));
  console.log(`Fixed paths in ${manifestFile}`);
}

// Fix paths in all files
htmlFiles.forEach(fixPathsInHtmlFile);
cssFiles.forEach(fixPathsInCssFile);
jsFiles.forEach(fixPathsInJsFile);
fixPathsInManifest();

console.log('All paths have been fixed for GitHub Pages deployment.');
