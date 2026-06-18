// @vitest-environment happy-dom

import { act, useState, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { FontAutocomplete } from './SettingsFormControls'

vi.mock('@/i18n/i18n', () => ({
  translate: (_key: string, defaultValue: string) => defaultValue
}))

describe('FontAutocomplete', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    document.body.replaceChildren()
  })

  it('arrow keys move through the full list when the input shows the committed font', async () => {
    function Harness(): ReactNode {
      const [value, setValue] = useState('Geist')
      return (
        <FontAutocomplete
          value={value}
          suggestions={['Arial', 'Courier New', 'Geist', 'JetBrains Mono', 'SF Mono']}
          onChange={setValue}
        />
      )
    }

    await act(async () => {
      root.render(<Harness />)
    })

    const input = container.querySelector<HTMLInputElement>('input[role="combobox"]')
    if (!input) {
      throw new Error('Font autocomplete input not found')
    }

    await act(async () => {
      input.focus()
    })

    await act(async () => {
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    })

    expect(
      container
        .querySelector<HTMLButtonElement>('[role="option"][aria-selected="true"]')
        ?.textContent?.trim()
    ).toBe('JetBrains Mono')
  })
})
