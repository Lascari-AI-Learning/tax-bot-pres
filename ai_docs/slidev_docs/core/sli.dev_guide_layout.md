---
url: "https://sli.dev/guide/layout"
title: "Slide Layout | Slidev"
---

[Skip to content](https://sli.dev/guide/layout#VPContent)

On this page

# Slide Layout [​](https://sli.dev/guide/layout\#slide-layout)

Layouts in Slidev are used to define the structure for each slide. They are Vue components that wrap the content of the slides.

## Using Layouts [​](https://sli.dev/guide/layout\#use)

To use a layout, you can specify it in the frontmatter of the slide:

md

```
---
layout: quote
---

A quote from someone
```

By default, the layout of the first slide is `cover`, and the rest are `default`.

The layouts are loaded in the following order, and the last one loaded will override the previous ones:

1. default layouts. See [Built-in Layouts](https://sli.dev/builtin/layouts).
2. layouts provided by the theme
3. layouts provided by the addons
4. custom layouts in the `layouts` directory

See also:

✨ Slot Sugar for Layouts

[✨ Slot Sugar for Layouts](https://sli.dev/features/slot-sugar)

[Layout](https://sli.dev/features/#tags=layout) [Syntax](https://sli.dev/features/#tags=syntax)

A syntax sugar for named slots in layouts.

## Writing Layouts [​](https://sli.dev/guide/layout\#write)

📖 Writing Layouts

[📖 Writing Layouts](https://sli.dev/guide/write-layout)

[Guide](https://sli.dev/features/#tags=guide)

Click to read this guide