# Font Files Directory

Place your custom font files here with the following naming convention:

- `FontName-Regular.woff2`
- `FontName-Regular.woff`
- `FontName-Bold.woff2`
- `FontName-Bold.woff`
- etc.

## Supported formats:
- `.woff2` (recommended)
- `.woff`
- `.ttf`
- `.otf`

## Usage:
After adding font files here, reference them in `/styles/fonts.css` using:
```css
@font-face {
  font-family: 'YourFontName';
  src: url('/fonts/YourFont-Regular.woff2') format('woff2');
}
```