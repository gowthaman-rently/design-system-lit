# Design System POC

A proof of concept for a design system built as **Lit web components**, used from a
**React 19 (Vite)** app and a **Next.js 16** app, with React wrappers, server-side
rendering in Next.js, design tokens and Storybook.

```
design-system-poc/
├── packages/
│   └── ui/                 @gowthaman-rently/design-system-lit: the components
│       ├── src/            components (Lit + TypeScript)
│       │   └── react/      React wrappers
│       ├── stories/        Storybook stories
│       ├── .storybook/     Storybook config
│       └── tokens.css      design tokens (colors, spacing, light/dark themes)
├── apps/
│   ├── react-19/           @design-system-poc/react-19: Vite + React 19 demo
│   └── next-16/            @design-system-poc/next-16: Next.js 16 demo (server-rendered)
├── .github/workflows/      CI: Storybook to GitHub Pages, package publishing
├── pnpm-workspace.yaml     workspace packages + install-script approvals
└── tsconfig.base.json      TypeScript settings shared by the ui package
```

Both apps show the same showcase page that exercises every component.

## Requirements

- Node.js and pnpm (tested with Node 26.13 and pnpm 12.21)
- Run every command from the repository root.

## Getting started

```bash
pnpm install
pnpm --filter design-system-lit build    # apps load the components from packages/ui/dist
```

Then, in two terminals:

```bash
pnpm dev:ui       # terminal 1: rebuilds the components on every save
pnpm dev:react    # terminal 2: React app on http://localhost:5173
# or
pnpm dev:next     # terminal 2: Next.js app on http://localhost:3000
```

The React and Next.js apps can run at the same time.

## Commands

| Command          | What it does                                                             |
| ---------------- | ------------------------------------------------------------------------ |
| `pnpm dev:ui`    | Watches `packages/ui/src` and rebuilds `dist/` on save                   |
| `pnpm dev:react` | Starts the React app (Vite)                                              |
| `pnpm dev:next`  | Starts the Next.js app                                                   |
| `pnpm storybook` | Starts Storybook on http://localhost:6006                                |
| `pnpm build`     | Builds everything; the ui package is built first                         |
| `pnpm typecheck` | Type-checks every package, including the stories                         |
| `pnpm lint`      | Lints both apps                                                          |

To run any other script in one package: `pnpm --filter <name> <script>`, for example
`pnpm --filter next-16 start` or `pnpm --filter design-system-lit build-storybook`.

## How it fits together

- **The ui package is compiled by TypeScript alone** (`tsc`), from `src/` into `dist/`
  (`.js` + `.d.ts`). There is no bundler, which is how Lit recommends shipping components.
- **The apps use the built output** (`dist/`) like any outside app would. That's why
  `pnpm dev:ui` must be running, or `pnpm --filter design-system-lit build` must have been run, while you
  work on the apps.
- **The package has three entry points:**

  | Import                             | Gives you                                                      |
  | ---------------------------------- | -------------------------------------------------------------- |
  | `@gowthaman-rently/design-system-lit`            | The custom elements (`<ds-button>`, …), for any framework      |
  | `@gowthaman-rently/design-system-lit/react`      | React components (`<Button>`, …); also registers the elements  |
  | `@gowthaman-rently/design-system-lit/tokens.css` | Design tokens; import once per app                             |

- **`custom-elements.json`** describes every component (properties, events, slots, CSS
  parts). It is generated from the JSDoc in `src/` by `cem analyze` during the build, and
  it powers the Storybook docs and editor autocompletion. It is not committed.

## Using the components

### In React or Next.js

```tsx
// Once, in the app entry (main.tsx or app/layout.tsx)
import '@gowthaman-rently/design-system-lit/tokens.css'

// Anywhere
import { Button, TextField } from '@gowthaman-rently/design-system-lit/react'

<TextField
  name="email"
  type="email"
  label="Email"
  required
  value={email}
  onInput={(e) => setEmail(e.detail.value)}
/>
<Button type="submit">Create account</Button>
```

Always import from `@gowthaman-rently/design-system-lit/react` in React apps, not from the plain entry:
the React entry also sets up server-side rendering (see below).

Component events are `ds-*` custom events. The wrappers expose them as typed React props:

| Component   | Event       | React prop |
| ----------- | ----------- | ---------- |
| `TextField` | `ds-input`  | `onInput`  |
| `TextField` | `ds-change` | `onChange` |
| `Tabs`      | `ds-change` | `onChange` |
| `Dialog`    | `ds-close`  | `onClose`  |

### Without React

Any app with a bundler (Vite, webpack, …) can use the elements directly:

```html
<link rel="stylesheet" href="…/tokens.css" />
<script type="module">
  import '@gowthaman-rently/design-system-lit'
</script>

<ds-button variant="secondary">Save</ds-button>
```

## Components

| Element                         | React                | Highlights                                                                    |
| ------------------------------- | -------------------- | ----------------------------------------------------------------------------- |
| `<ds-button>`                   | `Button`             | 4 variants, 3 sizes, disabled and loading states, prefix/suffix slots, submits and resets forms |
| `<ds-text-field>`               | `TextField`          | Label, hint and error text; works in native forms (`FormData`, reset, `required`/`email` validation) |
| `<ds-dialog>`                   | `Dialog`             | Modal built on the native `<dialog>`: focus moves in and back out, Escape and backdrop click close it |
| `<ds-tabs>` + `<ds-tab>` + `<ds-tab-panel>` | `Tabs` + `Tab` + `TabPanel` | Tab labels can hold icons or badges; arrow keys, Home/End, mirrored in right-to-left layouts |

`<my-element>` is the example component from the original Vite template.

During development, every component was checked in both apps with axe (no violations in
light or dark theme), keyboard-only use and right-to-left layouts. There are no automated
tests in the repository yet. Full API docs are in Storybook.

## Theming

- `tokens.css` defines every `--ds-*` variable, with a light and a dark theme.
- The dark theme follows the OS setting. Force a theme with `<html data-theme="dark">` or
  `<html data-theme="light">`.
- Re-theme any part of a page by overriding tokens on an ancestor element:

  ```css
  .brand {
    --ds-color-primary: #0f766e;
    --ds-color-on-primary: #ffffff;
  }
  ```

- Restyle a component's inner elements with `::part()`. Each component lists its parts in
  Storybook.

  ```css
  .pill::part(base) {
    border-radius: 999px;
  }
  ```

Components keep their visual styles inside their shadow DOM, never on `:host`, so page CSS
resets (such as Tailwind's) don't break them.

## Server-side rendering (Next.js)

The Next.js app renders the components' shadow DOM on the server, so pages are styled
before any JavaScript loads. It uses `@lit-labs/ssr-react` and needs no Next.js config:
the first import in `packages/ui/src/react/index.ts` patches React on the server and loads
Lit's hydration support in the browser. **That import must stay first.**

Rules for writing components that work with server rendering:

1. **Don't touch the DOM in the constructor** (no `MutationObserver`, no reading
   children). On the server, only the constructor, `willUpdate` and `render` run.
2. **Render from properties, not from child elements.** The server can't see children, so
   anything that must be in the server HTML has to come from the element's own properties.
   For example, each `<ds-tab>` renders its own button from its `selected` property, which
   the React `Tabs` sets from `value`. `<ds-tabs>` reads its children only in the browser,
   after the first render, so that render matches the server's.
3. **Don't use manual slot assignment.** Server-rendered shadow DOM can't express it.
4. **Render `nothing`, not `''`,** for text that starts empty and fills in later.
   Otherwise, after hydration, Lit writes the text into a comment marker.
5. **Don't reflect string properties with default values to attributes.** Adding
   attributes during hydration makes React report a mismatch.
6. **Don't rely on `slotchange` alone.** With server-rendered HTML the slot is already
   filled before the listener exists; check the slot again after the first render.

Known limit: `@lit-labs/ssr-react` is an experimental Lit Labs package.

## Storybook

```bash
pnpm storybook    # http://localhost:6006
```

Hosted version: https://gowthaman-rently.github.io/design-system-lit/. It is rebuilt and
deployed by `.github/workflows/storybook.yml` on every push to `master` that changes the
ui package.

- Stories live in `packages/ui/stories/`, outside `src/`, so they are never published.
- The **Introduction** page and the **React and Next.js** and **Rails** guides are MDX
  files in the same folder (`introduction.mdx`, `guide-react.mdx`, `guide-rails.mdx`).
- Each component gets a docs page built from its JSDoc: attributes, properties, events,
  slots and CSS parts.
- The toolbar switches the **theme** (light/dark) and the **direction** (LTR/RTL).
- Panels: **Accessibility** (axe results), **Actions** (logs `ds-*` events), **Controls**.

## Publishing the package

`packages/ui` is published to GitHub Packages as `@gowthaman-rently/design-system-lit` by
`.github/workflows/publish.yml`.

To release a new version:

1. Set `"version"` in `packages/ui/package.json` (for example `0.2.0`) and push to `master`.
2. On GitHub, publish a **Release** with the tag `v0.2.0`. The workflow builds and
   publishes the package. It fails if the tag doesn't match the version.

You can also publish the current version with **Actions → Publish package → Run
workflow**. A version can only be published once.

Installing it in another project needs a GitHub token, even though the package is public;
see [packages/ui/README.md](packages/ui/README.md). Inside this repo, the apps use the
local package through `workspace:*`, so nothing has to be published to work on them.

## Adding a component

1. Create `packages/ui/src/<name>.ts` with a Lit element named `ds-<name>`:
   - document it with JSDoc: `@slot`, `@fires`, `@csspart`;
   - style it with the `--ds-*` tokens and include `baseStyles` from `styles.ts`;
   - follow the server-rendering rules above.
2. Export it from `packages/ui/src/index.ts`.
3. Add a React wrapper in `packages/ui/src/react/index.ts` with `createComponent`, mapping
   its `ds-*` events to `on*` props.
4. Add `packages/ui/stories/<name>.stories.ts`.
5. If it shows content that shouldn't appear before JavaScript loads, add a
   `:not(:defined)` rule at the end of `tokens.css`.
6. Run `pnpm typecheck` and `pnpm build`.

## Adding an app

1. Create it in `apps/<name>` **without installing dependencies**, for example
   `pnpm create next-app apps/<name> --skip-install`. A nested install creates a separate
   lockfile and `pnpm-workspace.yaml` that cut the app off from the workspace.
2. In its `package.json`, set `"name": "@design-system-poc/<name>"`, remove any
   `packageManager` field, and add `"@gowthaman-rently/design-system-lit": "workspace:*"` to
   `dependencies`.
3. Run `pnpm install` from the root.
4. Add `"dev:<name>": "pnpm --filter <name> dev"` to the root `package.json`.
5. Import `@gowthaman-rently/design-system-lit/tokens.css` once, and use the components from
   `@gowthaman-rently/design-system-lit/react`.

## Good to know

- **Keep React versions in sync.** The `react` version in `packages/ui` (dev dependency)
  must match the React app's, or the app loads two copies of React and the wrappers break.
  Next.js isn't affected because it uses its own built-in React.
- **Components can't import image or CSS files.** The package is compiled by `tsc` alone,
  so put styles in Lit's `css` and reference images by URL.
- **Install scripts are denied** for `sharp`, `unrs-resolver`, `esbuild` and
  `rs-module-lexer` (`allowBuilds` in `pnpm-workspace.yaml`). Everything works without
  them. When pnpm stops on a new package with install scripts, decide there.
- **Tabs and ARIA:** a tab can't point to its panel with `aria-controls`, because they
  live in different shadow roots. In the browser, each panel gets its accessible name from
  the text of its tab.
