import { resolve } from 'path'
import { defineWindiSetup } from '@slidev/types'

export default defineWindiSetup(() => ({
  extract: {
    include: [
      resolve(__dirname, '../**/*.{vue,ts}'),
    ],
  },
  theme: {
    extend: {
      colors: {
        'slate-steel': '#4C5A61',
        'bone-white': '#EAE7DC',
        'fog-grey': '#B0B3B8',
        'iron-ochre': '#A35E35',
        'obsidian-black': '#0C0C0C',
        'ash-graphite': '#2B2B2B',
        'primary': {
          '400': '#A35E35',
          '500': '#8B4F2D',
          '600': '#734025',
          '700': '#5A311D',
        }
      },
    },
  },
  shortcuts: {
    // custom the default background
    'bg-main': 'bg-white text-[#181818] dark:(bg-[#121212] text-[#ddd])',
  },
}))
