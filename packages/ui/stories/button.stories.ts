import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'
import '../src/button.js'
import type { DsButton } from '../src/button.js'

type Args = Pick<DsButton, 'variant' | 'size' | 'disabled' | 'loading'> & { label: string }

const meta = {
  title: 'Components/Button',
  component: 'ds-button',
  args: { label: 'Button', variant: 'primary', size: 'md', disabled: false, loading: false },
  argTypes: {
    label: { description: 'Default slot content' },
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost', 'danger'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  render: (args) => html`
    <ds-button variant=${args.variant} size=${args.size} ?disabled=${args.disabled} ?loading=${args.loading}>
      ${args.label}
    </ds-button>
  `,
} satisfies Meta<Args>

export default meta
type Story = StoryObj<Args>

export const Primary: Story = {}

export const Secondary: Story = { args: { variant: 'secondary' } }

export const Ghost: Story = { args: { variant: 'ghost' } }

export const Danger: Story = { args: { variant: 'danger', label: 'Delete' } }

export const Disabled: Story = { args: { disabled: true } }

export const Loading: Story = { args: { loading: true, label: 'Saving…' } }

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; gap: 0.5rem; align-items: center">
      <ds-button size="sm">Small</ds-button>
      <ds-button>Medium</ds-button>
      <ds-button size="lg">Large</ds-button>
    </div>
  `,
}

export const WithIcon: Story = {
  render: () => html`
    <ds-button>
      <svg slot="prefix" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
        <path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      </svg>
      Add item
    </ds-button>
  `,
}

/** Restyle the inner button with `::part(base)`, and re-theme an area by overriding tokens. */
export const Customized: Story = {
  render: () => html`
    <style>
      .pill::part(base) {
        border-radius: 999px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      .brand {
        --ds-color-primary: #0f766e;
        --ds-color-primary-hover: #115e59;
        --ds-color-on-primary: #ffffff;
      }
    </style>
    <div style="display: flex; gap: 0.5rem">
      <ds-button class="pill">Styled via ::part(base)</ds-button>
      <span class="brand"><ds-button>Brand tokens</ds-button></span>
    </div>
  `,
}
