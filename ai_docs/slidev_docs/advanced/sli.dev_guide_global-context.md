---
url: "https://sli.dev/guide/global-context"
title: "Global Context | Slidev"
---

[Skip to content](https://sli.dev/guide/global-context#VPContent)

On this page

# Global Context [​](https://sli.dev/guide/global-context\#global-context)

Slidev injects several global context values for advanced navigation controls.

## Direct Usage [​](https://sli.dev/guide/global-context\#direct-usage)

You can access them directly in your slides or components:

slides.md

md

```
# Page 1

Current page is: {{ $nav.currentPage }}
```

Foo.vue

vue

```
<template>
  <div>Title: {{ $slidev.configs.title }}</div>
  <button @click="$nav.next">
    Next Click
  </button>
  <button @click="$nav.nextSlide">
    Next Slide
  </button>
</template>
```

## Composable Usage [​](https://sli.dev/guide/global-context\#composable-usage)

> Available since v0.48.0

If you want to get the context programmatically (also type-safely), you can import composables from `@slidev/client`:

vue

```
<script setup>
import { onSlideEnter, onSlideLeave, useDarkMode, useIsSlideActive, useNav, useSlideContext } from '@slidev/client'

const { $slidev } = useSlideContext()
const { currentPage, currentLayout, currentSlideRoute } = useNav()
const { isDark } = useDarkMode()
const isActive = useIsSlideActive()
onSlideEnter(() => { /* ... */ })
onSlideLeave(() => { /* ... */ })
// ...
</script>
```

NOTE

Previously, you might see the usage of importing nested modules like `import { isDark } from '@slidev/client/logic/dark.ts'`, this is **NOT RECOMMENDED** as they are internal implementation details and may change in the future. Always use the public APIs from `@slidev/client` if possible.

WARNING

When the `useSlideContext` composable is used in a file, the automatic injection of `$slidev` will be disabled. You need to manually get the `$slidev` object to the `useSlideContext` function.

See also:

✨ Slide Hooks

[✨ Slide Hooks](https://sli.dev/features/slide-hook)

[Client API](https://sli.dev/features/#tags=client-api)

Hooks to manage the slide lifecycle.

## Properties [​](https://sli.dev/guide/global-context\#properties)

### `$slidev` [​](https://sli.dev/guide/global-context\#slidev)

The global context object.

### `$frontmatter` [​](https://sli.dev/guide/global-context\#frontmatter)

The frontmatter object of the current slide. Note that this is empty for components out of the slides like ✨ Global Layers

[✨ Global Layers](https://sli.dev/features/global-layers)

.

### `$clicks` [​](https://sli.dev/guide/global-context\#clicks)

`$clicks` hold the number of clicks on the current slide. Can be used conditionally to show different content on clicks.

html

```
<div v-if="$clicks > 3">Content</div>
```

See the 📖 Animations

[📖 Animations](https://sli.dev/guide/animations)

guide for more information.

A reactive object holding the properties and controls of the slide navigation. For examples:

js

```
$nav.next() // go next step
$nav.nextSlide() // go next slide (skip clicks)
$nav.go(10) // go slide #10

$nav.currentPage // current slide number
$nav.currentLayout // current layout name
```

For more properties available, refer to the [`SlidevContextNav` interface](https://github.com/slidevjs/slidev/blob/main/packages/client/composables/useNav.ts).

### `$page` [​](https://sli.dev/guide/global-context\#page)

`$page` holds the number of the current page, 1-indexed.

md

```
Page: {{ $page }}

Is current page active: {{ $page === $nav.currentPage }}
```

\> \`$nav.clicks\` is a global state while \`$clicks\` is the local clicks number for each slide.

### `$renderContext` [​](https://sli.dev/guide/global-context\#render-context)

`$renderContext` holds the current render context, which can be `slide`, `overview`, `presenter` or `previewNext`

md

```
<div v-if="['slide', 'presenter'].includes($renderContext)">
  This content will only be rendered in main slides view
</div>
```

You can also use the [`<RenderWhen>` component](https://sli.dev/builtin/components#renderwhen).

### `$slidev.configs` [​](https://sli.dev/guide/global-context\#configs)

A reactive object holding the configurations for the slide project. For example:

md

```
---
title: My First Slidev!
---

# Page 1

---

# Any Page

{{ $slidev.configs.title }} // 'My First Slidev!'
```

### `$slidev.themeConfigs` [​](https://sli.dev/guide/global-context\#theme-configs)

A reactive object holding the parsed theme configurations:

yaml

```
---
title: My First Slidev!
themeConfig:
  primary: '#213435'
---
```

Then the theme can access the primary color like:

md

```
{{ $slidev.themeConfigs.primary }} // '#213435'
```

## Types [​](https://sli.dev/guide/global-context\#types)

If you want to get a type programmatically, you can import types like `TocItem` from `@slidev/types`:

vue

```
<script setup>
import type { TocItem } from '@slidev/types'

function tocFunc(tree: TocItem[]): TocItem[] {
  // ...
}
</script>
```