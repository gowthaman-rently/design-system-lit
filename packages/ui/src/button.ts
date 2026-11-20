import { LitElement, css, html, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { baseStyles } from './styles.js'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

/**
 * A button. Inside a `<form>`, `type="submit"` submits it and `type="reset"` resets it.
 *
 * @slot - The label.
 * @slot prefix - Content before the label, e.g. an icon.
 * @slot suffix - Content after the label.
 * @csspart base - The inner `<button>`.
 * @csspart label - Wrapper around the label.
 * @csspart spinner - The loading spinner.
 */
@customElement('ds-button')
export class DsButton extends LitElement {
  static formAssociated = true
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true }

  @property() variant: ButtonVariant = 'primary'
  @property() size: ButtonSize = 'md'
  @property() type: 'button' | 'submit' | 'reset' = 'button'
  @property({ type: Boolean, reflect: true }) disabled = false
  /** Shows a spinner and ignores clicks, but stays focusable (unlike `disabled`). */
  @property({ type: Boolean, reflect: true }) loading = false

  private readonly internals = this.attachInternals()

  constructor() {
    super()
    // Capture phase on the host: runs before any outside click listener (e.g. React's onClick).
    this.addEventListener('click', this.handleClick, { capture: true })
  }

  /** Called by the browser when an ancestor `<fieldset disabled>` changes. */
  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled
  }

  private handleClick = (event: MouseEvent) => {
    if (this.disabled || this.loading) {
      event.preventDefault()
      event.stopImmediatePropagation()
      return
    }
    const form = this.internals.form
    if (form && this.type === 'submit') form.requestSubmit()
    if (form && this.type === 'reset') form.reset()
  }

  render() {
    const classes = { button: true, [this.variant]: true, [this.size]: true }
    return html`
      <button
        part="base"
        class=${classMap(classes)}
        type="button"
        ?disabled=${this.disabled}
        aria-disabled=${this.loading ? 'true' : nothing}
        aria-busy=${this.loading ? 'true' : nothing}
      >
        <slot name="prefix"></slot>
        <span part="label" class="label"><slot></slot></span>
        <slot name="suffix"></slot>
        ${this.loading
          ? html`<span part="spinner" class="spinner" aria-hidden="true"></span>`
          : nothing}
      </button>
    `
  }

  static styles = [
    baseStyles,
    css`
      :host {
        display: inline-block;
      }

      .button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: var(--ds-space-2);
        width: 100%;
        height: var(--ds-control-height-md);
        padding-inline: var(--ds-space-4);
        border: 1px solid transparent;
        border-radius: var(--ds-radius-md);
        font: inherit;
        font-size: var(--ds-font-size-md);
        font-weight: var(--ds-font-weight-medium);
        line-height: 1;
        white-space: nowrap;
        cursor: pointer;
        transition-property: background-color, border-color, color;
        transition-duration: var(--ds-duration);
        transition-timing-function: var(--ds-easing);
      }

      .sm {
        height: var(--ds-control-height-sm);
        padding-inline: var(--ds-space-3);
        font-size: var(--ds-font-size-sm);
      }
      .lg {
        height: var(--ds-control-height-lg);
        padding-inline: var(--ds-space-6);
        font-size: var(--ds-font-size-lg);
      }

      .primary {
        background: var(--ds-color-primary);
        color: var(--ds-color-on-primary);
      }
      .primary:hover:enabled {
        background: var(--ds-color-primary-hover);
      }
      .secondary {
        background: var(--ds-color-surface);
        color: var(--ds-color-text);
        border-color: var(--ds-color-border-strong);
      }
      .secondary:hover:enabled {
        background: var(--ds-color-surface-raised);
      }
      .ghost {
        background: transparent;
        color: var(--ds-color-primary);
      }
      .ghost:hover:enabled {
        background: var(--ds-color-primary-subtle);
      }
      .danger {
        background: var(--ds-color-danger);
        color: var(--ds-color-on-danger);
      }
      .danger:hover:enabled {
        background: var(--ds-color-danger-hover);
      }

      .button:disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }
      :host([loading]) .button {
        cursor: progress;
      }

      .spinner {
        width: 1em;
        height: 1em;
        border: 2px solid currentColor;
        border-inline-end-color: transparent;
        border-radius: 50%;
        animation: spin 0.7s linear infinite;
      }
      @keyframes spin {
        to {
          transform: rotate(1turn);
        }
      }

      @media (forced-colors: active) {
        .button {
          border-color: ButtonText;
        }
        .button:disabled {
          border-color: GrayText;
          color: GrayText;
        }
      }
    `,
  ]
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-button': DsButton
  }
}
