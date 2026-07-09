import { useEffect } from 'react'
import { CalendarClock, ExternalLink, RefreshCw, Sparkles } from 'lucide-react'
import { AgentIcon } from '@/lib/agent-catalog'
import { translate } from '@/i18n/i18n'
import { useAppStore } from '../../store'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { StatCard } from './StatCard'
import { formatUpdatedAt } from './usage-formatters'

export function GrokUsagePane(): React.JSX.Element {
  const grok = useAppStore((s) => s.rateLimits.grok)
  const grokAuthConfigured = useAppStore((s) => s.rateLimits.grokAuthConfigured)
  const refreshRateLimits = useAppStore((s) => s.refreshRateLimits)
  const openSettingsPage = useAppStore((s) => s.openSettingsPage)
  const openSettingsTarget = useAppStore((s) => s.openSettingsTarget)
  const recordFeatureInteraction = useAppStore((s) => s.recordFeatureInteraction)

  useEffect(() => {
    void refreshRateLimits()
  }, [refreshRateLimits])

  const openGrokAccounts = (): void => {
    openSettingsTarget({ pane: 'accounts', repoId: null, sectionId: 'accounts-grok' })
    openSettingsPage()
  }

  if (!grokAuthConfigured) {
    return (
      <div
        className="rounded-lg border border-border/60 bg-card/40 p-4"
        data-testid="grok-usage-pane"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <AgentIcon agent="grok" size={16} />
              {translate('auto.components.stats.GrokUsagePane.a1c2e3f4b5', 'Grok usage')}
            </h3>
            <p className="text-sm text-muted-foreground">
              {translate(
                'auto.components.stats.GrokUsagePane.b2d3e4f5c6',
                'Weekly subscription credits from Grok CLI OAuth (~/.grok/auth.json), not local chat logs.'
              )}
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            size="sm"
            onClick={() => {
              recordFeatureInteraction('usage-tracking')
              openGrokAccounts()
            }}
          >
            {translate('auto.components.stats.GrokUsagePane.c3e4f5a6b7', 'Set up in Accounts')}
          </Button>
        </div>
      </div>
    )
  }

  const weeklyPercent =
    grok?.weekly && typeof grok.weekly.usedPercent === 'number'
      ? Math.round(grok.weekly.usedPercent)
      : null
  const isFetching = grok?.status === 'fetching'

  return (
    <div className="space-y-4" data-testid="grok-usage-pane">
      <div className="rounded-lg border border-border/60 bg-card/40 p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 space-y-1">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <AgentIcon agent="grok" size={16} />
              {translate('auto.components.stats.GrokUsagePane.a1c2e3f4b5', 'Grok usage')}
            </h3>
            <p className="text-xs text-muted-foreground">
              {formatUpdatedAt(grok?.updatedAt ?? null)}
              {grok?.error ? ` — ${grok.error}` : ''}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            disabled={isFetching}
            onClick={() => void refreshRateLimits()}
          >
            <RefreshCw className={`size-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            {translate('auto.components.stats.GrokUsagePane.d4f5a6b7c8', 'Refresh')}
          </Button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <StatCard
            label={translate(
              'auto.components.stats.GrokUsagePane.e5a6b7c8d9',
              'Weekly credits used'
            )}
            value={weeklyPercent !== null ? `${weeklyPercent}%` : '—'}
            icon={<Sparkles className="size-4" />}
          />
          <StatCard
            label={translate(
              'auto.components.stats.GrokUsagePane.f6b7c8d9e0',
              'Billing period reset'
            )}
            value={grok?.weekly?.resetDescription ?? '—'}
            icon={<CalendarClock className="size-4" />}
          />
        </div>

        {grok?.usageMetadata?.authProvenance ? (
          <p className="mt-3 truncate text-xs text-muted-foreground">
            {grok.usageMetadata.authProvenance}
          </p>
        ) : null}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {weeklyPercent !== null ? (
            <Badge variant="secondary" className="tabular-nums">
              {weeklyPercent}%
            </Badge>
          ) : null}
          <Button variant="ghost" size="sm" className="gap-1" onClick={openGrokAccounts}>
            {translate('auto.components.stats.GrokUsagePane.a7b8c9d0e1', 'Grok account settings')}
            <ExternalLink className="size-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}
