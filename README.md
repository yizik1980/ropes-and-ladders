# 🐍 Ropes and Ladders - Hebrew Learning Game

An interactive web-based game combining Snakes and Ladders with Hebrew letter recognition through image guessing.

## 📋 Setup

1. Install dependencies:
```bash
npm install
```

2. Build and minify for production:
```bash
npm run build
```

The minified files will be created in the `dist/` folder:
- `dist/index.html` - Minified HTML
- `dist/script.min.js` - Minified JavaScript
- `dist/style.min.css` - Minified CSS

## 🎮 Game Features

- **Multi-player Support** - Play with 2-4 players
- **Hebrew Letter Learning** - Guess objects by their starting Hebrew letter
- **3D Dice** - Beautiful 3D rolling dice animation
- **22 Learning Items** - Various objects, animals, and items for learning
- **Snakes & Ladders** - Classic game mechanics with movement bonuses

## 📂 Project Structure

```
.
├── index.html          # Main HTML file
├── script.js           # Game logic
├── style.css           # Styles
├── build.js            # Build script for bundling and minification
├── package.json        # Dependencies configuration
└── dist/               # Production-ready minified files (generated)
```

## 🛠️ Development

Edit the source files (`index.html`, `script.js`, `style.css`) and run `npm run build` to generate optimized production files.

## 📦 Build Output

The build process:
1. **Minifies JavaScript** using esbuild
2. **Minifies CSS** using cssnano
3. **Minifies HTML** using html-minifier
4. **Updates references** to point to minified files

Files are reduced by ~60-70% in size.
