'use client'

// React wrappers for the design-system web components.
//   import { Button } from '@design-system-poc/ui/react'
// Importing this file also registers the custom elements in the browser.
// Component events (ds-*) are exposed as typed React props (onInput, onChange, onClose).

// Lit SSR. Must stay the first import, before anything that loads `lit`:
// - on the server it patches React so Lit components render their shadow DOM
//   (as <template shadowrootmode>) into the HTML;
// - in the browser it loads Lit's hydration support, so components reuse that
//   server-rendered shadow DOM instead of rendering again.
import '@lit-labs/ssr-react/enable-lit-ssr.js'

import { createComponent, type EventName } from '@lit/react'
import * as React from 'react'
import { DsButton } from '../button.js'
import { DsDialog } from '../dialog.js'
import { MyElement as MyElementWC } from '../my-element.js'
import { DsTabPanel, DsTabs } from '../tabs.js'
import { DsTextField } from '../text-field.js'

type ValueEvent = EventName<CustomEvent<{ value: string }>>

export const Button = createComponent({
  tagName: 'ds-button',
  elementClass: DsButton,
  react: React,
})

export const TextField = createComponent({
  tagName: 'ds-text-field',
  elementClass: DsTextField,
  react: React,
  events: {
    onInput: 'ds-input' as ValueEvent,
    onChange: 'ds-change' as ValueEvent,
  },
})

export const Dialog = createComponent({
  tagName: 'ds-dialog',
  elementClass: DsDialog,
  react: React,
  events: {
    onClose: 'ds-close',
  },
})

export const Tabs = createComponent({
  tagName: 'ds-tabs',
  elementClass: DsTabs,
  react: React,
  events: {
    onChange: 'ds-change' as ValueEvent,
  },
})

export const TabPanel = createComponent({
  tagName: 'ds-tab-panel',
  elementClass: DsTabPanel,
  react: React,
})

export const MyElement = createComponent({
  tagName: 'my-element',
  elementClass: MyElementWC,
  react: React,
})
