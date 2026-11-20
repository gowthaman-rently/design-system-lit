import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import type { MyElement } from '@design-system-poc/ui'

/**
 * JSX props for a custom element: the usual HTML attributes (className, id,
 * children, ref, ...) plus the element's own public properties listed in `Props`.
 */
type CustomElementProps<T extends HTMLElement, Props extends keyof T = never> =
  DetailedHTMLProps<HTMLAttributes<T>, T> & Partial<Pick<T, Props>>

// Teach TypeScript about the design-system tags so they can be used in TSX.
// Add an entry here for each new component exported by @design-system-poc/ui.
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'my-element': CustomElementProps<MyElement, 'count'>
    }
  }
}
