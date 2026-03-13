---
url: "https://sli.dev/guide/write-layout"
title: "Writing Layouts | Slidev"
---

[Skip to content](https://sli.dev/guide/write-layout#VPContent)

Return to top

# Writing Layouts [​](https://sli.dev/guide/write-layout\#writing-layouts)

> Please read 📖 Layouts
>
> [📖 Layouts](https://sli.dev/guide/layout)
>
>  first.

To create a custom layout, simply create a new Vue file in the `layouts` directory:

bash

```
your-slidev/
  ├── ...
  ├── slides.md
  └── layouts/
      ├── ...
      └── MyLayout.vue
```

Layouts are Vue components, so you can use all the features of Vue in them.

In the layout component, use `<slot/>` (the default slot) for the slide content:

default.vue

vue

```
<template>
  <div class="slidev-layout default">
    <slot />
  </div>
</template>
```

You can also have [named slots](https://vuejs.org/guide/components/slots.html) for more complex layouts:

split.vue

vue

```
<template>
  <div class="slidev-layout split">
    <div class="left">
      <slot name="left" />
    </div>
    <div class="right">
      <slot name="right" />
    </div>
  </div>
</template>
```

And then use it with ✨ Slot Sugar for Layouts

[✨ Slot Sugar for Layouts](https://sli.dev/features/slot-sugar)

.