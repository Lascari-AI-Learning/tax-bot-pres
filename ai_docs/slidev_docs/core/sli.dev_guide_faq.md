---
url: "https://sli.dev/guide/faq"
title: "FAQ | Slidev"
---

[Skip to content](https://sli.dev/guide/faq#VPContent)

On this page

# FAQ [​](https://sli.dev/guide/faq\#faq)

## Assets Handling [​](https://sli.dev/guide/faq\#assets-handling)

You may use static assets like images and videos in your slides. Since Slidev is based on Vite, you can import them directly in your markdown files.

URLs that can be statically analyzed as assets can use relative paths:

md

```
![alt](./image.png)
<img src="./image.png" />
```

In the above case, the URLs will be resolved to `/BASE_URL/assets/image.png` after build.

However, relative paths in frontmatter and other components will be broken after build:

md

```
---
background: ./image.png  # Broken after build
---

<Comp src="./image.png" />
```

In the above case, the URLs are not statically analyzable and will be preserved as-is, which will result in 404 errors after build.

To solve this, you can place these assets in the [public folder](https://sli.dev/custom/directory-structure#public) and use an absolute path to import them:

md

```
---
background: /image.png
---

<Comp src="/image.png" />
```

For more details, refer to [Vite's documentation](https://vitejs.dev/guide/assets.html).

## Positioning [​](https://sli.dev/guide/faq\#positioning)

Since Slidev is web-based, CSS is the primary way to position elements. Here are some useful tips for position elements:

### Grids And Flexboxes [​](https://sli.dev/guide/faq\#grids-and-flexboxes)

You can use CSS Grids to create complex layouts:

Two columnsComplex case

md

```
<div class="grid grid-cols-2 gap-4">
  <div>
    The first column
  </div>
  <div>
    The second column
  </div>
</div>
```

md

```
<div class="grid grid-cols-[200px_1fr_10%] gap-4">
  <div>
    The first column (200px)
  </div>
  <div>
    The second column (auto fit)
  </div>
  <div>
    The third column (10% width to parent container)
  </div>
</div>
```

And use Flexboxes to create more responsive layouts:

HorizontalVertical

md

```
<div class="flex items-center">
  <div>
    First block
  </div>
  <div>
    Second block
  </div>
</div>
```

md

```
<div class="flex flex-col items-center">
  <div>
    Centered content
  </div>
</div>
```

Learn more: [CSS Grids](https://css-tricks.com/snippets/css/complete-guide-grid/), [flexboxes](https://css-tricks.com/snippets/css/a-guide-to-flexbox/), or even [Masonry](https://css-tricks.com/native-css-masonry-layout-in-css-grid/).

### Absolute Position [​](https://sli.dev/guide/faq\#absolute-position)

You can use UnoCSS to position elements absolutely:

md

```
<div class="absolute left-30px bottom-30px">
  This is a left-bottom aligned footer
</div>
```

Or use the draggable elements feature:

✨ Draggable Elements

[✨ Draggable Elements](https://sli.dev/features/draggable)

[Layout](https://sli.dev/features/#tags=layout)

Move, resize, and rotate elements by dragging them with the mouse.

## Adjust Sizes [​](https://sli.dev/guide/faq\#adjust-size)

- Adjust all slides's size:

✨ Slide Canvas Size

[✨ Slide Canvas Size](https://sli.dev/features/canvas-size)

[Layout](https://sli.dev/features/#tags=layout)

Set the size for all your slides.

- Adjust several slides' size:

✨ Zoom Slides

[✨ Zoom Slides](https://sli.dev/features/zoom-slide)

[Layout](https://sli.dev/features/#tags=layout)

Zoom the content of a slide to a specific scale.

- Adjust some elements' size:

✨ The \`Transform\` Component

[✨ The \`Transform\` Component](https://sli.dev/features/transform-component)

[Layout](https://sli.dev/features/#tags=layout)

A component for scaling some elements.