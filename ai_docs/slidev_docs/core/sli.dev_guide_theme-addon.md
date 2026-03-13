---
url: "https://sli.dev/guide/theme-addon"
title: "Theme and Addons | Slidev"
---

[Skip to content](https://sli.dev/guide/theme-addon#VPContent)

On this page

# Theme and Addons [​](https://sli.dev/guide/theme-addon\#theme-and-addons)

A slides project can have one theme and multiple addons. All of them can provide styles, components, layouts, and other configs to your slides project.

## Use a Theme [​](https://sli.dev/guide/theme-addon\#use-theme)

Changing the theme in Slidev is surprisingly easy. All you need to do is to add the `theme` option in your [headmatter](https://sli.dev/custom/index#headmatter):

md

```
---
theme: seriph
---

# The first slide
```

You can find the list of official themes and community themes in the [Themes Gallery](https://sli.dev/resources/theme-gallery).

Theme name convention

- You can also pass a relative or absolute path to a local theme folder, like `../my-theme`
- You can always use the full package name as the theme name
- If the theme is [official](https://sli.dev/resources/theme-gallery#official-themes) or is named like `slidev-theme-name`, you can omit the `slidev-theme-` prefix
- For scoped packages like `@org/slidev-theme-name`, the full package name is required

You can start the server and will be prompted to install the theme after a confirmation.

```
? The theme "@slidev/theme-seriph" was not found in your project, do you want to install it now? › (Y/n)

```

or install the theme manually via:

bash

```
$ npm install @slidev/theme-seriph
```

And that's all, enjoy the new theme! For more details about the usage, you can refer to the theme's README.

See also:

✨ Eject Theme

[✨ Eject Theme](https://sli.dev/features/eject-theme)

[Theme](https://sli.dev/features/#tags=theme) [CLI](https://sli.dev/features/#tags=cli)

Eject the installed theme from your project to customize it.

## Use an Addon [​](https://sli.dev/guide/theme-addon\#use-addon)

Addons are similar to themes, but they are more flexible and can be used to add extra features to your slides project. You can add multiple addons to your project, and they can be used to add extra features to your slides project.

To use an addon, you can add the `addons` option in your [headmatter](https://sli.dev/custom/index#headmatter):

md

```
---
addons:
  - excalidraw
  - '@slidev/plugin-notes'
---
```

You can find the list of official addons and community addons in the [Addons Gallery](https://sli.dev/resources/addon-gallery).