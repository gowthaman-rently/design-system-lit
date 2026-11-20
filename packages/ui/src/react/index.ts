'use client'

// React wrappers for the design-system web components.
//   import { Button } from '@gowthaman-rently/design-system-lit/react'
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
import { DsTab, DsTabPanel, DsTabs } from '../tabs.js'
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

export const TabPanel = createComponent({
  tagName: 'ds-tab-panel',
  elementClass: DsTabPanel,
  react: React,
})

const TabElement = createComponent({
  tagName: 'ds-tab',
  elementClass: DsTab,
  react: React,
})

type TabProps = Omit<React.ComponentPropsWithoutRef<typeof TabElement>, 'slot'>

/** `<ds-tab>` for React. It is placed in the tab row (`slot="nav"`) automatically. */
export const Tab = React.forwardRef<DsTab, TabProps>(function Tab(props, ref) {
  return React.createElement(TabElement, { ...props, slot: 'nav', ref })
})

const TabsElement = createComponent({
  tagName: 'ds-tabs',
  elementClass: DsTabs,
  react: React,
  events: {
    onChange: 'ds-change' as ValueEvent,
  },
})

type TabPanelProps = React.ComponentPropsWithoutRef<typeof TabPanel>
type TabsProps = React.ComponentPropsWithoutRef<typeof TabsElement>

const isTab = (node: React.ReactNode): node is React.ReactElement<TabProps> =>
  React.isValidElement(node) && node.type === Tab
const isTabPanel = (node: React.ReactNode): node is React.ReactElement<TabPanelProps> =>
  React.isValidElement(node) && node.type === TabPanel

/**
 * `<ds-tabs>` for React. It marks the selected `Tab` `selected` and the selected
 * `TabPanel` `active` from `value`, so the right tab and panel are also rendered on
 * the server. `Tab`s and `TabPanel`s must be direct children.
 */
export const Tabs = React.forwardRef<DsTabs, TabsProps>(function Tabs({ children, ...props }, ref) {
  const tabs = React.Children.toArray(children).filter(isTab)
  const selected = (tabs.find((tab) => tab.props.panel === props.value) ?? tabs[0])?.props.panel

  return React.createElement(
    TabsElement,
    { ...props, ref },
    React.Children.map(children, (child) => {
      if (isTab(child)) return React.cloneElement(child, { selected: child.props.panel === selected })
      if (isTabPanel(child)) return React.cloneElement(child, { active: child.props.name === selected })
      return child
    }),
  )
})

export const MyElement = createComponent({
  tagName: 'my-element',
  elementClass: MyElementWC,
  react: React,
})
