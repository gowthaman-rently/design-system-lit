import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'
import { withActions } from 'storybook/actions/decorator'
import '../src/tabs.js'
import type { DsTabs } from '../src/tabs.js'

type Args = Pick<DsTabs, 'label' | 'value'>

const meta = {
  title: 'Components/Tabs',
  component: 'ds-tabs',
  subcomponents: { TabPanel: 'ds-tab-panel' },
  decorators: [withActions],
  parameters: { actions: { handles: ['ds-change'] } },
  args: { label: 'Project settings', value: 'general' },
  argTypes: {
    value: { control: 'inline-radio', options: ['general', 'members', 'billing'] },
  },
  render: (args) => html`
    <ds-tabs label=${args.label} value=${args.value}>
      <ds-tab-panel name="general" label="General">
        <p>Project name, description and visibility.</p>
      </ds-tab-panel>
      <ds-tab-panel name="members" label="Members">
        <p>Invite people and manage their roles.</p>
      </ds-tab-panel>
      <ds-tab-panel name="billing" label="Billing">
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

/** The arrow keys are mirrored: Right moves to the previous tab. */
export const RightToLeft: Story = { globals: { direction: 'rtl' } }
