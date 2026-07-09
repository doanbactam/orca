import type { StatusBarItem } from '../../../../shared/types'
import { translate } from '@/i18n/i18n'
import { translateSearchKeyword } from './settings-search-keywords'

export function getGrokStatusBarToggleSearchEntry(): {
  id: StatusBarItem
  title: string
  description: string
  keywords: string[]
  toggleDescription: string
} {
  return {
    id: 'grok',
    title: translate('auto.components.settings.appearance.search.grokUsage', 'Grok Usage'),
    description: translate(
      'auto.components.settings.appearance.search.grokUsageDesc',
      'Show Grok weekly credit usage from Grok CLI OAuth.'
    ),
    keywords: [
      ...translateSearchKeyword(
        'auto.components.settings.appearance.search.896eb53fd4',
        'status bar'
      ),
      ...translateSearchKeyword('auto.components.settings.appearance.search.grokKw', 'grok'),
      ...translateSearchKeyword('auto.components.settings.appearance.search.xaiKw', 'xai'),
      ...translateSearchKeyword('auto.components.settings.appearance.search.00a028f25f', 'usage'),
      ...translateSearchKeyword(
        'auto.components.settings.appearance.search.de586def95',
        'subscription'
      )
    ],
    toggleDescription: translate(
      'settings.appearance.statusBar.grokToggleDescription',
      'Show Grok subscription credit usage when signed in via Grok CLI.'
    )
  }
}
