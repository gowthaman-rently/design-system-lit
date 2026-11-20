import { LitElement, css, html, type PropertyValues } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { baseStyles } from './styles.js'

/**
 * A modal dialog built on the native `<dialog>`: it traps focus, closes on
 * Escape or a backdrop click, and returns focus to where it was.
 *
 * @fires ds-close - After the dialog closes, for any reason. Keep `open` in sync with it.
 * @slot - Body content.
 * @slot footer - Actions, e.g. buttons.
 * @csspart dialog - The native `<dialog>`.
 * @csspart header - Header with the title and close button.
 * @csspart title - The title (`<h2>`).
 * @csspart close-button - The close button.
 * @csspart body - Wrapper around the body slot.
 * @csspart footer - Wrapper around the footer slot.
 */
@customElement('ds-dialog')
export class DsDialog extends LitElement {
  @property({ type: Boolean, reflect: true }) open = false
  /** Title in the header; also the dialog's accessible name. */
  @property() label = ''
  /** Accessible name of the close button. Translate it for other languages. */
  @property({ attribute: 'close-label' }) closeLabel = 'Close'

  @state() private hasFooter = false

  @query('dialog') private dialog!: HTMLDialogElement
  @query('slot[name="footer"]') private footerSlot!: HTMLSlotElement

  protected async firstUpdated() {
    // With server-rendered HTML the slot is already filled before our slotchange
    // listener exists, so check once after the first render has finished.
    await this.updateComplete
    this.hasFooter = this.footerSlot.assignedElements().length > 0
  }

  protected updated(changed: PropertyValues<this>) {
    if (!changed.has('open')) return
    if (this.open && !this.dialog.open) this.dialog.showModal()
    if (!this.open && this.dialog.open) this.dialog.close()
  }

  /** The native dialog closed (Escape, close button, backdrop, or `open = false`). */
  private handleClose() {
    this.open = false
    this.dispatchEvent(new CustomEvent('ds-close', { bubbles: true, composed: true }))
  }

  /** A click on the `<dialog>` itself, outside the panel, is a click on the backdrop. */
  private handleClick(event: MouseEvent) {
    if (event.target === this.dialog) this.dialog.close()
  }

  private handleFooterSlotChange(event: Event) {
    this.hasFooter = (event.target as HTMLSlotElement).assignedElements().length > 0
  }

  render() {
    return html`
      <dialog
        part="dialog"
        aria-labelledby="title"
        @close=${this.handleClose}
        @click=${this.handleClick}
      >
        <div class="panel">
          <header part="header">
            <h2 part="title" id="title">${this.label}</h2>
            <button
              part="close-button"
              class="close"
              type="button"
              aria-label=${this.closeLabel}
              @click=${() => this.dialog.close()}
            >
              <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
                <path
                  d="M4 4l8 8M12 4l-8 8"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </svg>
            </button>
          </header>
          <div part="body" class="body"><slot></slot></div>
          <footer part="footer" ?hidden=${!this.hasFooter}>
            <slot name="footer" @slotchange=${this.handleFooterSlotChange}></slot>
          </footer>
        </div>
      </dialog>
    `
  }

  static styles = [
    baseStyles,
    css`
      :host {
        display: contents;
      }

      dialog {
        width: min(32rem, calc(100vw - 2 * var(--ds-space-4)));
        max-height: calc(100dvh - 2 * var(--ds-space-4));
        padding: 0;
        border: none;
        border-radius: var(--ds-radius-lg);
        background: var(--ds-color-surface);
        color: var(--ds-color-text);
        box-shadow: var(--ds-shadow-dialog);
      }
      dialog::backdrop {
        background: var(--ds-color-backdrop);
      }
      dialog[open] {
        animation: enter var(--ds-duration) var(--ds-easing);
      }
      @keyframes enter {
        from {
          opacity: 0;
          transform: translateY(8px) scale(0.98);
        }
      }

      .panel {
        display: flex;
        flex-direction: column;
        max-height: inherit;
      }

      header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--ds-space-4);
        padding: var(--ds-space-4) var(--ds-space-6);
        border-bottom: 1px solid var(--ds-color-border);
      }
      h2 {
        margin: 0;
        font-size: var(--ds-font-size-lg);
        font-weight: var(--ds-font-weight-bold);
      }

      .close {
        display: inline-grid;
        flex: none;
        place-items: center;
        width: 2rem;
        height: 2rem;
        border: none;
        border-radius: var(--ds-radius-sm);
        background: transparent;
        color: var(--ds-color-text-muted);
        cursor: pointer;
      }
      .close:hover {
        background: var(--ds-color-surface-raised);
        color: var(--ds-color-text);
      }

      .body {
        padding: var(--ds-space-6);
        overflow-y: auto;
      }

      footer {
        display: flex;
        justify-content: flex-end;
        gap: var(--ds-space-2);
        padding: var(--ds-space-4) var(--ds-space-6);
        border-top: 1px solid var(--ds-color-border);
      }
      footer[hidden] {
        display: none;
      }
    `,
  ]
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-dialog': DsDialog
  }
}
