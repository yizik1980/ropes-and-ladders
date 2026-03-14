import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as esbuild from 'esbuild';
import postcss from 'postcss';
import cssnano from 'cssnano';
import minifier from 'html-minifier';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, 'dist');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

async function minifyJS() {
  try {
    await esbuild.build({
      entryPoints: ['src/main.js'],
      bundle: true,
      minify: true,
      outfile: path.join(distDir, 'script.min.js'),
      platform: 'browser',
      target: 'es2020',
      define: {
        'process.env.API_URL': JSON.stringify(process.env.API_URL || ''),
      },
    });
    console.log('✓ JavaScript bundled & minified: dist/script.min.js');
  } catch (error) {
    console.error('✗ Error bundling JavaScript:', error);
    process.exit(1);
  }
}

async function minifyCSS() {
  try {
    const css = fs.readFileSync('style.css', 'utf-8');
    const result = await postcss([cssnano()]).process(css, { from: 'style.css' });
    fs.writeFileSync(path.join(distDir, 'style.min.css'), result.css);
    console.log('✓ CSS minified: dist/style.min.css');
  } catch (error) {
    console.error('✗ Error minifying CSS:', error);
    process.exit(1);
  }
}

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
      removeScriptTypeAttributes: false,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true,
    });
    const updated = minified
      .replace(`type="module" src="src/main.js"`, `src="script.min.js" defer`)
      .replace('style.css', 'style.min.css');
    fs.writeFileSync(path.join(distDir, 'index.html'), updated);
    console.log('✓ HTML minified: dist/index.html');
  } catch (error) {
    console.error('✗ Error minifying HTML:', error);
    process.exit(1);
  }
}

async function build() {
  console.log('🔨 Building...');
  await minifyJS();
  await minifyCSS();
  await minifyHTML();
  console.log('✅ Build complete! Files in ./dist/');
}

build();
