import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'
import { withActions } from 'storybook/actions/decorator'
import '../src/button.js'
import '../src/text-field.js'
import type { DsTextField } from '../src/text-field.js'

type Args = Pick<
  DsTextField,
  'label' | 'type' | 'value' | 'placeholder' | 'hint' | 'error' | 'required' | 'disabled' | 'readonly'
>

const meta = {
  title: 'Components/TextField',
  component: 'ds-text-field',
  decorators: [withActions],
  parameters: { actions: { handles: ['ds-input', 'ds-change'] } },
  args: {
    label: 'Email',
    type: 'email',
    value: '',
    placeholder: 'you@example.com',
    hint: '',
    error: '',
    required: false,
    disabled: false,
    readonly: false,
  },
  argTypes: {
    type: { control: 'select', options: ['text', 'email', 'password', 'search', 'tel', 'url'] },
  },
  render: (args) => html`
    <ds-text-field
      style="max-width: 24rem"
      label=${args.label}
      type=${args.type}
      .value=${args.value}
      placeholder=${args.placeholder}
      hint=${args.hint}
      error=${args.error}
      ?required=${args.required}
      ?disabled=${args.disabled}
      ?readonly=${args.readonly}
    ></ds-text-field>
  `,
} satisfies Meta<Args>

export default meta
type Story = StoryObj<Args>

export const Default: Story = {}

export const WithHint: Story = { args: { hint: 'We never share your email.' } }

export const Required: Story = { args: { required: true, hint: 'Leave the field empty and tab out to see the error.' } }

export const WithError: Story = { args: { value: 'ada@example.com', error: 'This email is already registered.' } }

export const Disabled: Story = { args: { value: 'ada@example.com', disabled: true } }

/** Values reach `FormData` like native inputs; required fields block submit; reset restores them. */
export const InAForm: Story = {
  render: () => html`
    <form
      style="display: grid; gap: 1rem; max-width: 24rem"
      @submit=${(event: SubmitEvent) => {
        event.preventDefault()
        const form = event.target as HTMLFormElement
        form.querySelector('output')!.textContent = JSON.stringify(Object.fromEntries(new FormData(form)))
      }}
    >
      <ds-text-field name="name" label="Full name" required></ds-text-field>
      <ds-text-field name="email" type="email" label="Email" required></ds-text-field>
      <div style="display: flex; gap: 0.5rem">
        <ds-button type="submit">Submit</ds-button>
        <ds-button type="reset" variant="ghost">Reset</ds-button>
      </div>
      <output></output>
    </form>
  `,
}
