const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');
const postcss = require('postcss');
const cssnano = require('cssnano');
const minifier = require('html-minifier');

const distDir = path.join(__dirname, 'dist');

// Create dist directory if it doesn't exist
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Minify JavaScript
async function minifyJS() {
  try {
    const result = await esbuild.build({
      entryPoints: ['script.js'],
      bundle: false,
      minify: true,
      outfile: path.join(distDir, 'script.min.js'),
      platform: 'browser',
      target: 'es2020',
    });
    console.log('✓ JavaScript minified:', result);
  } catch (error) {
    console.error('✗ Error minifying JavaScript:', error);
  }
}

// Minify CSS
async function minifyCSS() {
  try {
    const css = fs.readFileSync('style.css', 'utf-8');
    const result = await postcss([cssnano()]).process(css, { from: 'style.css' });
    fs.writeFileSync(path.join(distDir, 'style.min.css'), result.css);
    console.log('✓ CSS minified: dist/style.min.css');
  } catch (error) {
    console.error('✗ Error minifying CSS:', error);
  }
}

// Minify HTML
async function minifyHTML() {
  try {
    const html = fs.readFileSync('index.html', 'utf-8');
    const minified = minifier.minify(html, {
      removeComments: true,
      collapseWhitespace: true,
      minifyJS: true,
      minifyCSS: true,
      removeEmptyAttributes: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true,
    });
    
    // Replace script and link references to minified versions
    let updated = minified
      .replace('script.js', 'script.min.js')
      .replace('style.css', 'style.min.css');
    
    fs.writeFileSync(path.join(distDir, 'index.html'), updated);
    console.log('✓ HTML minified: dist/index.html');
  } catch (error) {
    console.error('✗ Error minifying HTML:', error);
  }
}

// Build all
async function build() {
  console.log('🔨 Building and minifying...');
  await minifyJS();
  await minifyCSS();
  await minifyHTML();
  console.log('✅ Build complete! Files in ./dist/');
}

build();
