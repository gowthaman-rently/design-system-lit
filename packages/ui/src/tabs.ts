import { LitElement, css, html, nothing, type PropertyValues } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { baseStyles } from './styles.js'

/**
 * One tab of `<ds-tabs>`. Its content is the tab's label, so it can include
 * icons or badges. Place it in the tab row with `slot="nav"` (the React `Tab`
 * does this for you).
 *
 * @slot - The tab's label.
 * @csspart base - The tab (`role="tab"`).
 */
@customElement('ds-tab')
export class DsTab extends LitElement {
  /** Name of the `<ds-tab-panel>` this tab shows. */
  @property() panel = ''
  /**
   * Whether the tab is selected. Set by `<ds-tabs>` from its `value` (and on the
   * server by the React `Tabs`). Reflected, so CSS can style the selected tab.
   */
  @property({ type: Boolean, reflect: true }) selected = false

  @query('button') private button?: HTMLButtonElement

  /** Moves focus to the tab. */
  override focus(options?: FocusOptions) {
    this.button?.focus(options)
  }

  protected updated(changed: PropertyValues<this>) {
    // Let the parent <ds-tabs> sync its tabs and panels again.
    if (changed.has('panel') && this.parentElement instanceof DsTabs) this.parentElement.requestUpdate()
  }

  render() {
    return html`<button
      part="base"
      class="tab"
      type="button"
      role="tab"
      aria-selected=${this.selected ? 'true' : 'false'}
      tabindex=${this.selected ? 0 : -1}
    >
      <slot></slot>
    </button>`
  }

  static styles = [
    baseStyles,
    css`
      :host {
        display: inline-flex;
      }
      .tab {
        position: relative;
        display: inline-flex;
        align-items: center;
        gap: var(--ds-space-2);
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

/**
 * One panel of `<ds-tabs>`, shown by the `<ds-tab>` whose `panel` matches its `name`.
 *
 * @slot - Panel content.
 * @csspart base - The panel (`role="tabpanel"`).
 */
@customElement('ds-tab-panel')
export class DsTabPanel extends LitElement {
  /** Identifies the panel; a `<ds-tab panel>` and `<ds-tabs value>` refer to it by this name. */
  @property() name = ''
  /**
   * Whether the panel is shown. Set by `<ds-tabs>` from its `value` (and on the
   * server by the React `Tabs`). Reflected, so CSS can show the selected panel
   * before JavaScript loads.
   */
  @property({ type: Boolean, reflect: true }) active = true
  /**
   * The text of the panel's tab, used as its accessible name. Set by `<ds-tabs>`.
   * @internal
   */
  @property({ attribute: false }) tabLabel = ''

  protected updated(changed: PropertyValues<this>) {
    // Let the parent <ds-tabs> sync its tabs and panels again.
    if (changed.has('name') && this.parentElement instanceof DsTabs) this.parentElement.requestUpdate()
  }

  render() {
    return html`<div
      part="base"
      class="panel"
      role="tabpanel"
      tabindex="0"
      aria-label=${this.tabLabel || nothing}
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
 * Tabs: a row of `<ds-tab slot="nav">` elements, each showing the
 * `<ds-tab-panel>` with the matching name.
 * Keyboard: Left/Right arrows move between tabs (mirrored in right-to-left
 * layouts), Home/End jump to the first/last tab.
 *
 * @slot nav - The `<ds-tab>` elements.
 * @slot - The `<ds-tab-panel>` elements.
 * @fires ds-change - When the user selects a tab. `event.detail.value` is the panel's name.
 * @csspart tablist - The row of tabs.
 */
@customElement('ds-tabs')
export class DsTabs extends LitElement {
  /** Name of the selected panel. Defaults to the tab marked `selected`, or the first tab. */
  @property() value = ''
  /** Accessible name of the tab list. */
  @property() label = ''

  private childObserver?: MutationObserver

  connectedCallback() {
    super.connectedCallback()
    this.childObserver = new MutationObserver(() => this.requestUpdate())
    this.childObserver.observe(this, { childList: true })
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.childObserver?.disconnect()
  }

  private get tabs() {
    return [...this.children].filter((child) => child instanceof DsTab)
  }

  private get selectedName(): string | undefined {
    const tabs = this.tabs
    return (tabs.find((tab) => tab.panel === this.value) ?? tabs.find((tab) => tab.selected) ?? tabs[0])?.panel
  }

  /** Marks the selected tab and panel. Runs only in the browser (the server never calls `updated`). */
  protected updated() {
    const selected = this.selectedName
    const tabs = this.tabs
    for (const tab of tabs) tab.selected = tab.panel === selected
    for (const panel of this.children) {
      if (!(panel instanceof DsTabPanel)) continue
      panel.active = panel.name === selected
      panel.tabLabel = tabs.find((tab) => tab.panel === panel.name)?.textContent?.trim() ?? ''
    }
  }

  private select(name: string) {
    if (name === this.selectedName) return
    this.value = name
    this.dispatchEvent(new CustomEvent('ds-change', { detail: { value: name }, bubbles: true, composed: true }))
  }

  /** The `<ds-tab>` an event came from. */
  private tabOf(event: Event) {
    return event.composedPath().find((node) => node instanceof DsTab && node.parentElement === this) as DsTab | undefined
  }

  private handleClick(event: MouseEvent) {
    const tab = this.tabOf(event)
    if (tab) this.select(tab.panel)
  }

  private handleKeydown(event: KeyboardEvent) {
    const tabs = this.tabs
    const tab = this.tabOf(event)
    if (!tab) return
    const current = tabs.indexOf(tab)
    const step = getComputedStyle(this).direction === 'rtl' ? -1 : 1
    const targets: Record<string, number> = {
      ArrowRight: current + step,
      ArrowLeft: current - step,
      Home: 0,
      End: tabs.length - 1,
    }
    if (!(event.key in targets)) return
    event.preventDefault()
    const next = tabs[(targets[event.key] + tabs.length) % tabs.length]
    next.focus()
    this.select(next.panel)
  }

  render() {
    return html`
      <div
        part="tablist"
        class="tablist"
        role="tablist"
        aria-label=${this.label || nothing}
        @click=${this.handleClick}
        @keydown=${this.handleKeydown}
      >
        <slot name="nav"></slot>
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
        border-bottom: 1px solid var(--ds-color-border);
        overflow-x: auto;
      }
    `,
  ]
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-tabs': DsTabs
    'ds-tab': DsTab
    'ds-tab-panel': DsTabPanel
  }
}
