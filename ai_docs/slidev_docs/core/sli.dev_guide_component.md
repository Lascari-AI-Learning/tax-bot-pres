---
url: "https://sli.dev/guide/component"
title: "Components in Slides | Slidev"
---

[Skip to content](https://sli.dev/guide/component#VPContent)

On this page

# Components in Slides [​](https://sli.dev/guide/component\#components-in-slides)

One of the most powerful features of Slidev is the ability to use Vue components directly in your slides. This allows you to create interactive and dynamic content with ease.

## Using Components [​](https://sli.dev/guide/component\#use)

With the help of [`unplugin-vue-components`](https://github.com/unplugin/unplugin-vue-components), Slidev allows you to use Vue components directly in your slides without importing them manually:

md

```
# My Slide

<MyComponent :count="4"/>
```

The components come from:

- Built-in components. See [Built-in Components](https://sli.dev/builtin/components) for reference.
- Provided by the theme and addons. See 📖 Theme & Addons
[📖 Theme & Addons](https://sli.dev/guide/theme-addon)
.
- Custom components in the `components` directory. See the next section.

## Writing Components [​](https://sli.dev/guide/component\#write)

To create a custom component, simply create a new Vue file in the `components` directory:

bash

```
your-slidev/
  ├── ...
  ├── slides.md
  └── components/
      ├── ...
      └── MyComponent.vue
```

Refer to the [Vue documentation](https://vuejs.org/guide/essentials/component-basics.html) for how to write Vue components.

You can also 📖 Writing Addons

[📖 Writing Addons](https://sli.dev/guide/write-addon)

to reuse and share your components with others.