import { ExternalLink, RefreshCw } from 'lucide-react'
import { AgentIcon } from '@/lib/agent-catalog'
import { translate } from '@/i18n/i18n'
import { useAppStore } from '../../store'
import type { ProviderRateLimits } from '../../../../shared/rate-limit-types'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'

type SubscriptionRow = {
  agent: 'grok' | 'kimi' | 'minimax' | 'gemini'
  label: string
  usage: ProviderRateLimits | null
  configured: boolean
  accountsAnchor: string
}

function formatWeekly(usage: ProviderRateLimits | null): string | null {
  const weekly = usage?.weekly
  if (!weekly || typeof weekly.usedPercent !== 'number') {
    return null
  }
  return `${Math.round(weekly.usedPercent)}%`
}

function formatStatusHint(usage: ProviderRateLimits | null): string {
  if (!usage) {
    return translate(
      'auto.components.stats.SubscriptionUsageSection.a1b2c3d4e6',
      'Not loaded yet — refresh or finish setup in Accounts.'
    )
  }
  if (usage.status === 'fetching') {
    return translate('auto.components.stats.SubscriptionUsageSection.b2c3d4e5f7', 'Updating…')
  }
  if (usage.status === 'unavailable') {
    return translate(
      'auto.components.stats.SubscriptionUsageSection.c3d4e5f6a8',
      'Not configured — set up in AI Provider Accounts.'
    )
  }
  if (usage.error) {
    return usage.error
  }
  if (usage.weekly?.resetDescription) {
    return translate(
      'auto.components.stats.SubscriptionUsageSection.d4e5f6a7b9',
      'Resets {{when}}',
      { when: usage.weekly.resetDescription }
    )
  }
  return translate('auto.components.stats.SubscriptionUsageSection.e5f6a7b8c0', 'Active')
}

export function SubscriptionUsageSection(): React.JSX.Element {
  const rateLimits = useAppStore((s) => s.rateLimits)
  const geminiOAuth = useAppStore((s) => s.settings?.geminiCliOAuthEnabled === true)
  const refreshRateLimits = useAppStore((s) => s.refreshRateLimits)
  const openSettingsPage = useAppStore((s) => s.openSettingsPage)
  const openSettingsTarget = useAppStore((s) => s.openSettingsTarget)

  const rows: SubscriptionRow[] = [
    {
      agent: 'grok',
      label: translate('auto.components.stats.SubscriptionUsageSection.f6a7b8c9d1', 'Grok (xAI)'),
      usage: rateLimits.grok,
      configured: rateLimits.grokAuthConfigured,
      accountsAnchor: 'accounts-grok'
    },
    {
      agent: 'kimi',
      label: translate('auto.components.stats.SubscriptionUsageSection.a7b8c9d0e2', 'Kimi'),
      usage: rateLimits.kimi,
      configured: rateLimits.kimi !== null && rateLimits.kimi.status !== 'unavailable',
      accountsAnchor: 'accounts'
    },
    {
      agent: 'minimax',
      label: translate('auto.components.stats.SubscriptionUsageSection.b8c9d0e1f3', 'MiniMax'),
      usage: rateLimits.minimax,
      configured: rateLimits.minimaxCookieConfigured,
      accountsAnchor: 'accounts'
    },
    {
      agent: 'gemini',
      label: translate('auto.components.stats.SubscriptionUsageSection.c9d0e1f2a4', 'Gemini'),
      usage: rateLimits.gemini,
      configured: geminiOAuth,
      accountsAnchor: 'accounts'
    }
  ]

  const visibleRows = rows.filter(
    (row) => row.configured || row.usage?.weekly || row.usage?.session || row.usage?.status === 'ok'
  )

  const openAccounts = (anchor: string): void => {
    openSettingsTarget({ pane: 'accounts', repoId: null, sectionId: anchor })
    openSettingsPage()
  }

  return (
    <section className="space-y-3 rounded-lg border border-border/60 bg-card/30 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-foreground">
            {translate(
              'auto.components.stats.SubscriptionUsageSection.d0e1f2a3b5',
              'Subscription usage'
            )}
          </h3>
          <p className="text-xs text-muted-foreground">
            {translate(
              'auto.components.stats.SubscriptionUsageSection.e1f2a3b4c6',
              'Weekly credits and quotas from provider accounts (status bar uses the same data).'
            )}
          </p>
        </div>
        <Button variant="ghost" size="icon-xs" onClick={() => void refreshRateLimits()}>
          <RefreshCw className="size-3.5" />
        </Button>
      </div>

      {visibleRows.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          {translate(
            'auto.components.stats.SubscriptionUsageSection.f2a3b4c5d7',
            'No subscription providers set up. Open AI Provider Accounts to connect Grok CLI, MiniMax, or others.'
          )}
        </p>
      ) : (
        <ul className="space-y-2">
          {visibleRows.map((row) => {
            const weekly = formatWeekly(row.usage)
            return (
              <li
                key={row.agent}
                className="flex items-center justify-between gap-3 rounded-md border border-border/40 bg-muted/10 px-3 py-2"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <AgentIcon agent={row.agent} size={14} />
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium">{row.label}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {formatStatusHint(row.usage)}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {weekly ? (
                    <Badge variant="secondary" className="tabular-nums">
                      {weekly}
                    </Badge>
                  ) : null}
                  <Button
                    variant="outline"
                    size="xs"
                    className="gap-1"
                    onClick={() => openAccounts(row.accountsAnchor)}
                  >
                    {translate(
                      'auto.components.stats.SubscriptionUsageSection.a3b4c5d6e8',
                      'Accounts'
                    )}
                    <ExternalLink className="size-3" />
                  </Button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
