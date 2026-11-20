import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'
import { withActions } from 'storybook/actions/decorator'
import '../src/tabs.js'
import type { DsTabs } from '../src/tabs.js'

type Args = Pick<DsTabs, 'label' | 'value'>

const meta = {
  title: 'Components/Tabs',
  component: 'ds-tabs',
  subcomponents: { Tab: 'ds-tab', TabPanel: 'ds-tab-panel' },
  decorators: [withActions],
  parameters: { actions: { handles: ['ds-change'] } },
  args: { label: 'Project settings', value: 'general' },
  argTypes: {
    value: { control: 'inline-radio', options: ['general', 'members', 'billing'] },
  },
  render: (args) => html`
    <ds-tabs label=${args.label} value=${args.value}>
      <ds-tab slot="nav" panel="general">General</ds-tab>
      <ds-tab slot="nav" panel="members">Members</ds-tab>
      <ds-tab slot="nav" panel="billing">Billing</ds-tab>

      <ds-tab-panel name="general">
        <p>Project name, description and visibility.</p>
      </ds-tab-panel>
      <ds-tab-panel name="members">
        <p>Invite people and manage their roles.</p>
      </ds-tab-panel>
      <ds-tab-panel name="billing">
        <p>Plan, invoices and payment method.</p>
      </ds-tab-panel>
    </ds-tabs>
  `,
} satisfies Meta<Args>

export default meta
type Story = StoryObj<Args>

/** Click a tab, or focus one and use the arrow keys, Home and End. */
export const Default: Story = {}

export const SecondTabSelected: Story = { args: { value: 'members' } }

/** A tab's content is its label, so it can hold icons or badges. */
export const RichLabels: Story = {
  render: (args) => html`
    <ds-tabs label=${args.label} value=${args.value}>
      <ds-tab slot="nav" panel="general">General</ds-tab>
      <ds-tab slot="nav" panel="members">
        Members
        <span
          style="padding: 0 0.5em; border-radius: 999px; background: var(--ds-color-primary-subtle); font-size: var(--ds-font-size-sm)"
          >3</span
        >
      </ds-tab>
      <ds-tab-panel name="general">
        <p>Project name, description and visibility.</p>
      </ds-tab-panel>
      <ds-tab-panel name="members">
        <p>3 people have access to this project.</p>
      </ds-tab-panel>
    </ds-tabs>
  `,
}

/** The arrow keys are mirrored: Right moves to the previous tab. */
export const RightToLeft: Story = { globals: { direction: 'rtl' } }
