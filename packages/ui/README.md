# @gowthaman-rently/design-system-lit

Lit web components with React wrappers, design tokens (light and dark themes) and
server-side rendering support for Next.js.

- **Storybook (docs and live examples):** https://gowthaman-rently.github.io/design-system-lit/
- **Source:** https://github.com/gowthaman-rently/design-system-lit

## Install

The package is on GitHub Packages, which requires a token to install, even for public
packages.

1. Create a GitHub personal access token (classic) with the `read:packages` scope.
2. Add an `.npmrc` next to your `package.json`:

   ```ini
   @gowthaman-rently:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
   ```

3. Set `GITHUB_TOKEN` to your token in your shell or CI, then install:

   ```bash
   npm install @gowthaman-rently/design-system-lit
   ```

## Use

### React and Next.js

```tsx
// Once, in your app entry (main.tsx or app/layout.tsx)
import '@gowthaman-rently/design-system-lit/tokens.css'

// Anywhere
import { Button, TextField } from '@gowthaman-rently/design-system-lit/react'

<TextField name="email" type="email" label="Email" required onInput={(e) => setEmail(e.detail.value)} />
<Button type="submit">Create account</Button>
```

In Next.js, the components render their shadow DOM on the server automatically when they
are used through the `/react` entry point.

### Any other framework or plain HTML

```js
import '@gowthaman-rently/design-system-lit/tokens.css'
import '@gowthaman-rently/design-system-lit'
```

```html
<ds-button variant="secondary">Save</ds-button>
```

## Components

| Element                        | React               |
| ------------------------------ | ------------------- |
| `<ds-button>`                  | `Button`            |
| `<ds-text-field>`              | `TextField`         |
| `<ds-dialog>`                  | `Dialog`            |
| `<ds-tabs>` + `<ds-tab>` + `<ds-tab-panel>` | `Tabs` + `Tab` + `TabPanel` |

Properties, events, slots and CSS parts are documented in Storybook, and in
`custom-elements.json` in this package.

## Theming

Override any `--ds-*` variable from `tokens.css` on `:root` or any element, and force a
theme with `<html data-theme="dark">` or `<html data-theme="light">`.
