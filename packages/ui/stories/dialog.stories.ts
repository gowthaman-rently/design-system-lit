import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'
import { withActions } from 'storybook/actions/decorator'
import '../src/button.js'
import '../src/dialog.js'
import type { DsDialog } from '../src/dialog.js'

type Args = Pick<DsDialog, 'label' | 'closeLabel' | 'open'>

const openNextDialog = (event: Event) => {
  ;((event.currentTarget as HTMLElement).nextElementSibling as DsDialog).open = true
}
const closeParentDialog = (event: Event) => {
  ;((event.currentTarget as HTMLElement).closest('ds-dialog') as DsDialog).open = false
}

const meta = {
  title: 'Components/Dialog',
  component: 'ds-dialog',
  decorators: [withActions],
  parameters: { actions: { handles: ['ds-close'] } },
  args: { label: 'Delete project?', closeLabel: 'Close', open: false },
  render: (args) => html`
    <ds-button variant="danger" @click=${openNextDialog}>Delete project…</ds-button>
    <ds-dialog label=${args.label} close-label=${args.closeLabel} ?open=${args.open}>
      <p>This permanently deletes the project and all of its files.</p>
      <ds-button slot="footer" variant="secondary" @click=${closeParentDialog}>Cancel</ds-button>
      <ds-button slot="footer" variant="danger" @click=${closeParentDialog}>Delete</ds-button>
    </ds-dialog>
  `,
} satisfies Meta<Args>

export default meta
type Story = StoryObj<Args>

/** Open it, then try Tab, Escape, the close button and a click on the backdrop. */
export const Default: Story = {}

export const WithoutFooter: Story = {
  args: { label: 'Keyboard shortcuts' },
  render: (args) => html`
    <ds-button variant="secondary" @click=${openNextDialog}>Show shortcuts</ds-button>
    <ds-dialog label=${args.label} close-label=${args.closeLabel}>
      <p>Press <kbd>?</kbd> anywhere to open this list.</p>
    </ds-dialog>
  `,
}

/** Starts open. Left out of the docs page, where a modal would cover everything. */
export const OpenByDefault: Story = {
  tags: ['!autodocs'],
  args: { open: true },
}
