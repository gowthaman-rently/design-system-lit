import { LitElement, css, html, nothing } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { live } from 'lit/directives/live.js'
import { baseStyles } from './styles.js'

/**
 * A labelled text input. It takes part in forms (`FormData`, reset,
 * `required`/`type` validation) like a native `<input>`.
 *
 * @fires ds-input - On every keystroke. `event.detail.value` is the new value.
 * @fires ds-change - When the value is committed (blur or Enter).
 * @csspart base - Wrapper around everything.
 * @csspart label - The `<label>`.
 * @csspart input - The `<input>`.
 * @csspart hint - The hint text.
 * @csspart error - The error message.
 */
@customElement('ds-text-field')
export class DsTextField extends LitElement {
  static formAssociated = true
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true }

  @property() label = ''
  /** Form field name. Reflected, because forms read the `name` attribute. */
  @property({ reflect: true }) name?: string
  @property() value = ''
  @property() type: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url' = 'text'
  @property() placeholder = ''
  @property() autocomplete = ''
  /** Help text shown under the input. */
  @property() hint = ''
  /** Custom error message. Setting it marks the field invalid. */
  @property() error = ''
  @property({ type: Boolean, reflect: true }) required = false
  @property({ type: Boolean, reflect: true }) disabled = false
  @property({ type: Boolean, reflect: true }) readonly = false

  /** Built-in errors (required, email format) only show once the user has left the field or submitted. */
  @state() private touched = false

  @query('input') private input!: HTMLInputElement

  private readonly internals = this.attachInternals()
  private initialValue = ''

  constructor() {
    super()
    // Fired by the browser when a form submit finds this field invalid.
    this.addEventListener('invalid', () => (this.touched = true))
  }

  connectedCallback() {
    super.connectedCallback()
    this.initialValue = this.value
  }

  get form() {
    return this.internals.form
  }
  get validity() {
    return this.internals.validity
  }
  get validationMessage() {
    return this.internals.validationMessage
  }
  checkValidity() {
    return this.internals.checkValidity()
  }
  reportValidity() {
    this.touched = true
    return this.internals.reportValidity()
  }

  /** Browser callbacks for form-associated elements. */
  formResetCallback() {
    this.value = this.initialValue
    this.touched = false
  }
  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled
  }
  formStateRestoreCallback(state: string) {
    this.value = state
  }

  protected updated() {
    this.internals.setFormValue(this.value)
    if (this.error) {
      this.internals.setValidity({ customError: true }, this.error, this.input)
    } else {
      this.internals.setValidity(this.input.validity, this.input.validationMessage, this.input)
    }
  }

  private get errorMessage() {
    if (this.error) return this.error
    return this.touched && this.input ? this.input.validationMessage : ''
  }

  private handleInput() {
    this.value = this.input.value
    const detail = { value: this.value }
    this.dispatchEvent(new CustomEvent('ds-input', { detail, bubbles: true, composed: true }))
  }

  private handleChange() {
    this.touched = true
    const detail = { value: this.value }
    this.dispatchEvent(new CustomEvent('ds-change', { detail, bubbles: true, composed: true }))
  }

  render() {
    const errorMessage = this.errorMessage
    return html`
      <div part="base" class="field">
        <label part="label" for="input">
          ${this.label}${this.required
            ? html`<span class="required" aria-hidden="true"> *</span>`
            : nothing}
        </label>
        <input
          part="input"
          id="input"
          .value=${live(this.value)}
          type=${this.type}
          placeholder=${this.placeholder || nothing}
          autocomplete=${this.autocomplete || nothing}
          ?required=${this.required}
          ?disabled=${this.disabled}
          ?readonly=${this.readonly}
          aria-invalid=${errorMessage ? 'true' : 'false'}
          aria-describedby="hint error"
          @input=${this.handleInput}
          @change=${this.handleChange}
          @blur=${() => (this.touched = true)}
        />
        ${this.hint ? html`<div part="hint" id="hint" class="hint">${this.hint}</div>` : nothing}
        <div part="error" id="error" class="error" aria-live="polite">${
          // Not '': after SSR hydration, Lit would write later text into a comment marker.
          errorMessage || nothing
        }</div>
      </div>
    `
  }

  static styles = [
    baseStyles,
    css`
      :host {
        display: block;
      }

      .field {
        display: grid;
        gap: var(--ds-space-1);
      }

      label {
        color: var(--ds-color-text);
        font-size: var(--ds-font-size-sm);
        font-weight: var(--ds-font-weight-medium);
      }
      .required {
        color: var(--ds-color-danger-text);
      }

      input {
        height: var(--ds-control-height-md);
        padding-inline: var(--ds-space-3);
        border: 1px solid var(--ds-color-border-strong);
        border-radius: var(--ds-radius-md);
        background: var(--ds-color-surface);
        color: var(--ds-color-text);
        font: inherit;
        font-size: var(--ds-font-size-md);
      }
      input::placeholder {
        color: var(--ds-color-text-muted);
      }
      input:focus-visible {
        outline-offset: 0;
        border-color: var(--ds-color-focus-ring);
      }
      input[aria-invalid='true'] {
        border-color: var(--ds-color-danger-text);
      }
      input:disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }

      .hint {
        color: var(--ds-color-text-muted);
        font-size: var(--ds-font-size-sm);
      }
      .error {
        color: var(--ds-color-danger-text);
        font-size: var(--ds-font-size-sm);
      }
    `,
  ]
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-text-field': DsTextField
  }
}
