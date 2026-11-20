'use client'

// React wrappers for the design-system web components.
// Usage: import { MyElement } from '@design-system-poc/ui/react'
// Importing this file also registers the custom elements in the browser.
import { createComponent } from '@lit/react'
import * as React from 'react'
import { MyElement as MyElementWC } from '../my-element.js'

export const MyElement = createComponent({
  tagName: 'my-element',
  elementClass: MyElementWC,
  react: React,
})
