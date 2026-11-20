"use client";

import { useState, type FormEvent } from 'react'
import { Button, Dialog, TabPanel, Tabs, TextField } from '@design-system-poc/ui/react'
import './showcase.css'

const themes = ['system', 'light', 'dark'] as const
type Theme = (typeof themes)[number]

/** Exercises every design-system component: a11y, theming, forms, RTL, customization. */
export function Showcase() {
  const [theme, setTheme] = useState<Theme>('system')
  const [rtl, setRtl] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitted, setSubmitted] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [status, setStatus] = useState('')
  const [tab, setTab] = useState('general')

  function cycleTheme() {
    const next = themes[(themes.indexOf(theme) + 1) % themes.length]
    if (next === 'system') delete document.documentElement.dataset.theme
    else document.documentElement.dataset.theme = next
    setTheme(next)
  }

  function toggleDirection() {
    document.documentElement.dir = rtl ? 'ltr' : 'rtl'
    setRtl(!rtl)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = Object.fromEntries(new FormData(event.currentTarget))
    setSubmitted(JSON.stringify({ ...data, password: '••••••••' }, null, 2))
  }

  function handleReset() {
    setEmail('')
    setPassword('')
    setSubmitted('')
  }

  const passwordError = password && password.length < 8 ? 'Use at least 8 characters.' : ''

  return (
    <main className="showcase">
      <header className="showcase-header">
        <h1>Design system showcase</h1>
        <div className="row">
          <Button variant="secondary" size="sm" onClick={cycleTheme}>
            Theme: {theme}
          </Button>
          <Button variant="secondary" size="sm" onClick={toggleDirection}>
            Direction: {rtl ? 'RTL' : 'LTR'}
          </Button>
        </div>
      </header>

      <section aria-labelledby="buttons">
        <h2 id="buttons">Button</h2>
        <div className="row">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </div>
        <div className="row">
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
          <Button disabled>Disabled</Button>
          <Button loading>Saving…</Button>
        </div>
      </section>

      <section aria-labelledby="form">
        <h2 id="form">Text field in a form</h2>
        <form className="form" onSubmit={handleSubmit} onReset={handleReset}>
          <TextField name="name" label="Full name" autocomplete="name" required />
          <TextField
            name="email"
            type="email"
            label="Email"
            autocomplete="email"
            hint="We never share your email."
            required
            value={email}
            onInput={(e) => setEmail(e.detail.value)}
          />
          <TextField
            name="password"
            type="password"
            label="Password"
            autocomplete="new-password"
            required
            value={password}
            error={passwordError}
            onInput={(e) => setPassword(e.detail.value)}
          />
          <div className="row">
            <Button type="submit">Create account</Button>
            <Button type="reset" variant="ghost">
              Reset
            </Button>
          </div>
        </form>
        <div aria-live="polite">{submitted && <pre className="output">{submitted}</pre>}</div>
      </section>

      <section aria-labelledby="dialog">
        <h2 id="dialog">Dialog</h2>
        <p>
          Focus moves into the dialog and stays there. Escape, the close button or a click outside
          closes it, and focus returns to the button that opened it.
        </p>
        <div className="row">
          <Button variant="danger" onClick={() => setDialogOpen(true)}>
            Delete project…
          </Button>
          <span role="status">{status}</span>
        </div>
        <Dialog label="Delete project?" open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <p>This permanently deletes the project and all of its files.</p>
          <div slot="footer" className="row">
            <Button variant="secondary" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setStatus('Project deleted.')
                setDialogOpen(false)
              }}
            >
              Delete
            </Button>
          </div>
        </Dialog>
      </section>

      <section aria-labelledby="tabs">
        <h2 id="tabs">Tabs</h2>
        <Tabs label="Project settings" value={tab} onChange={(e) => setTab(e.detail.value)}>
          <TabPanel name="general" label="General">
            <p>Project name, description and visibility.</p>
          </TabPanel>
          <TabPanel name="members" label="Members">
            <p>Invite people and manage their roles.</p>
          </TabPanel>
          <TabPanel name="billing" label="Billing">
            <p>Plan, invoices and payment method.</p>
          </TabPanel>
        </Tabs>
        <p>Selected tab: {tab}</p>
      </section>

      <section aria-labelledby="custom">
        <h2 id="custom">Customization</h2>
        <p>
          Override tokens on any element, or style a component&apos;s insides with{' '}
          <code>::part()</code>.
        </p>
        <div className="row brand">
          <Button>Brand primary</Button>
          <Button variant="secondary">Rounded secondary</Button>
        </div>
        <div className="row">
          <Button className="pill">Styled via ::part(base)</Button>
        </div>
      </section>
    </main>
  )
}
