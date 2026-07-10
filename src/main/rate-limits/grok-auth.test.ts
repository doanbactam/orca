import { afterEach, describe, expect, it, vi } from 'vitest'

describe('readGrokAuthSession', () => {
  afterEach(() => {
    vi.resetModules()
    vi.doUnmock('node:fs')
  })

  it('redacts filesystem paths from auth read failures', async () => {
    vi.doMock('node:fs', () => ({
      existsSync: vi.fn(() => true),
      readFileSync: vi.fn(() => {
        throw new Error(
          'EACCES: permission denied, open /Users/brennanbenson/private/.grok/auth.json'
        )
      })
    }))
    const { readGrokAuthSession } = await import('./grok-auth')

    expect(readGrokAuthSession()).toEqual({
      status: 'error',
      error: 'Unable to read Grok auth file'
    })
  })

  it('reports malformed auth JSON without parser details', async () => {
    vi.doMock('node:fs', () => ({
      existsSync: vi.fn(() => true),
      readFileSync: vi.fn(() => '{')
    }))
    const { readGrokAuthSession } = await import('./grok-auth')

    expect(readGrokAuthSession()).toEqual({
      status: 'error',
      error: 'Grok auth file is invalid'
    })
  })
})
