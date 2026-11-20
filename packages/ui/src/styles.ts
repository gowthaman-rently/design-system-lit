import { css } from 'lit'

/**
 * Styles shared by every component.
 * Visual styles go on elements inside the shadow root, never on :host,
 * because page styles (e.g. CSS resets like Tailwind's) override :host rules.
 */
export const baseStyles = css`
  :host {
    box-sizing: border-box;
    font-family: var(--ds-font-family);
  }

  :host([hidden]) {
    display: none;
  }

  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }

  :focus-visible {
    outline: 2px solid var(--ds-color-focus-ring);
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
`
