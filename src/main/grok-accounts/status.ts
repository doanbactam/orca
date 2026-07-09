import { isGrokAccessTokenFresh, readGrokAuthSession } from '../rate-limits/grok-auth'

export type GrokAccountStatus = {
  signedIn: boolean
  email: string | null
  teamId: string | null
  tokenFresh: boolean
  error: string | null
}

export function getGrokAccountStatus(): GrokAccountStatus {
  const readResult = readGrokAuthSession()
  if (readResult.status === 'missing') {
    return {
      signedIn: false,
      email: null,
      teamId: null,
      tokenFresh: false,
      error: null
    }
  }
  if (readResult.status === 'error') {
    return {
      signedIn: false,
      email: null,
      teamId: null,
      tokenFresh: false,
      error: readResult.error
    }
  }
  const session = readResult.session
  return {
    signedIn: true,
    email: session.email,
    teamId: session.teamId,
    tokenFresh: isGrokAccessTokenFresh(session),
    error: null
  }
}
