import { withThemeByDataAttribute } from '@storybook/addon-themes'
import { setCustomElementsManifest, type Preview } from '@storybook/web-components-vite'
import manifest from '../custom-elements.json'
import '../tokens.css'
import './preview.css'

// The docs tables (properties, events, slots, CSS parts) come from the JSDoc in
// src/, via custom-elements.json, which `cem analyze` generates.
setCustomElementsManifest(manifest)

const preview: Preview = {
  tags: ['autodocs'],
  globalTypes: {
    direction: {
      description: 'Text direction',
      toolbar: { title: 'Direction', icon: 'transfer', items: ['ltr', 'rtl'], dynamicTitle: true },
    },
  },
  initialGlobals: { direction: 'ltr' },
  decorators: [
    // Theme toolbar: sets <html data-theme="light|dark">, like the apps do.
    withThemeByDataAttribute({
      themes: { light: 'light', dark: 'dark' },
      defaultTheme: 'light',
      attributeName: 'data-theme',
    }),
    // Direction toolbar: sets <html dir="ltr|rtl">.
    (story, context) => {
      document.documentElement.dir = context.globals.direction
      return story()
    },
  ],
  parameters: {
    controls: { expanded: true },
  },
}

export default preview
