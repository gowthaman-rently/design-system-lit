import { LitElement, css, html, nothing, type PropertyValues } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { baseStyles } from './styles.js'

/**
 * One panel of `<ds-tabs>`. Its `label` is the text of its tab.
 *
 * @slot - Panel content.
 * @csspart base - The panel (`role="tabpanel"`).
 */
@customElement('ds-tab-panel')
export class DsTabPanel extends LitElement {
  /** Identifies the panel; `<ds-tabs value>` selects a panel by this name. */
  @property() name = ''
  /** Text of the tab that shows this panel. */
  @property() label = ''
  /** Set by `<ds-tabs>`. Defaults to true so server-rendered HTML contains the content. */
  @property({ type: Boolean }) active = true

  protected updated(changed: PropertyValues<this>) {
    // Let the parent <ds-tabs> re-render its tab list.
    if (changed.has('name') || changed.has('label')) {
      if (this.parentElement instanceof DsTabs) this.parentElement.requestUpdate()
    }
  }

  render() {
    return html`<div
      part="base"
      class="panel"
      role="tabpanel"
      tabindex="0"
      aria-label=${this.label}
      ?hidden=${!this.active}
    >
      <slot></slot>
    </div>`
  }

  static styles = [
    baseStyles,
    css`
      :host {
        display: block;
      }
      .panel {
        padding-block: var(--ds-space-4);
        border-radius: var(--ds-radius-sm);
      }
      .panel[hidden] {
        display: none;
      }
    `,
  ]
}

/**
 * Tabs that each show one `<ds-tab-panel>` child.
 * Keyboard: Left/Right arrows move between tabs (mirrored in right-to-left
 * layouts), Home/End jump to the first/last tab.
 *
 * SSR: the server can't see child panels, so the tab list is rendered in the
 * browser after hydration; until then only the first panel is shown.
 *
 * @fires ds-change - When the user selects a tab. `event.detail.value` is the panel's name.
 * @csspart tablist - The row of tabs.
 * @csspart tab - Each tab.
 * @csspart tab-selected - The selected tab.
 */
@customElement('ds-tabs')
export class DsTabs extends LitElement {
  /** Name of the selected panel. Defaults to the first panel. */
  @property() value = ''
  /** Accessible name of the tab list. */
  @property() label = ''

  /** Child panels. Read after the first render (also in the browser) so hydration matches the server. */
  @state() private panels: DsTabPanel[] = []

  private childObserver?: MutationObserver

  connectedCallback() {
    super.connectedCallback()
    this.childObserver = new MutationObserver(() => this.readPanels())
    this.childObserver.observe(this, { childList: true })
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.childObserver?.disconnect()
  }

  protected async firstUpdated() {
    // Second render, after the first (hydrated) one has finished.
    await this.updateComplete
    this.readPanels()
  }

  protected updated() {
    const selected = this.selectedPanel
    for (const panel of this.panels) panel.active = panel === selected
  }

  private readPanels() {
    this.panels = [...this.children].filter((child) => child instanceof DsTabPanel)
  }

  private get selectedPanel(): DsTabPanel | undefined {
    return this.panels.find((panel) => panel.name === this.value) ?? this.panels[0]
  }

  private get tabs() {
    return [...this.renderRoot.querySelectorAll<HTMLButtonElement>('[role="tab"]')]
  }

  private select(panel: DsTabPanel) {
    if (panel === this.selectedPanel) return
    this.value = panel.name
    this.dispatchEvent(
      new CustomEvent('ds-change', { detail: { value: panel.name }, bubbles: true, composed: true }),
    )
  }

  private handleKeydown(event: KeyboardEvent) {
    const tabs = this.tabs
    const current = tabs.indexOf(event.target as HTMLButtonElement)
    if (current === -1) return
    const step = getComputedStyle(this).direction === 'rtl' ? -1 : 1
    const targets: Record<string, number> = {
      ArrowRight: current + step,
      ArrowLeft: current - step,
      Home: 0,
      End: tabs.length - 1,
    }
    if (!(event.key in targets)) return
    event.preventDefault()
    const next = (targets[event.key] + tabs.length) % tabs.length
    tabs[next].focus()
    this.select(this.panels[next])
  }

  render() {
    const selected = this.selectedPanel
    return html`
      ${this.panels.length === 0
        ? // Before the panels are known (server HTML, first render): show only the first one.
          html`<style>
            ::slotted(:not(:first-child)) {
              display: none;
            }
          </style>`
        : nothing}
      <div
        part="tablist"
        class="tablist"
        role="tablist"
        aria-label=${this.label || nothing}
        @keydown=${this.handleKeydown}
      >
        ${this.panels.map((panel) => {
          const isSelected = panel === selected
          return html`<button
            part=${isSelected ? 'tab tab-selected' : 'tab'}
            class="tab"
            role="tab"
            type="button"
            aria-selected=${isSelected ? 'true' : 'false'}
            tabindex=${isSelected ? 0 : -1}
            @click=${() => this.select(panel)}
          >
            ${panel.label}
          </button>`
        })}
      </div>
      <slot></slot>
    `
  }

  static styles = [
    baseStyles,
    css`
      :host {
        display: block;
      }

      .tablist {
        display: flex;
        gap: var(--ds-space-1);
        /* Reserve the row's height before the tabs render (SSR) to avoid layout shift. */
        min-height: calc(var(--ds-font-size-md) * 1.5 + 2 * var(--ds-space-2));
        border-bottom: 1px solid var(--ds-color-border);
        overflow-x: auto;
      }

      .tab {
        position: relative;
        padding: var(--ds-space-2) var(--ds-space-4);
        border: none;
        border-radius: var(--ds-radius-sm) var(--ds-radius-sm) 0 0;
        background: none;
        color: var(--ds-color-text-muted);
        font: inherit;
        font-size: var(--ds-font-size-md);
        font-weight: var(--ds-font-weight-medium);
        line-height: 1.5;
        white-space: nowrap;
        cursor: pointer;
      }
      .tab:hover {
        color: var(--ds-color-text);
      }
      .tab:focus-visible {
        outline-offset: -2px;
      }
      .tab[aria-selected='true'] {
        color: var(--ds-color-primary);
      }
      .tab[aria-selected='true']::after {
        content: '';
        position: absolute;
        inset-inline: 0;
        bottom: -1px;
        height: 2px;
        background: currentColor;
      }

      @media (forced-colors: active) {
        .tab[aria-selected='true']::after {
          background: Highlight;
        }
      }
    `,
  ]
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-tabs': DsTabs
    'ds-tab-panel': DsTabPanel
  }
}
