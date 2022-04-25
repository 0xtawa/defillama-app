import { useTvlFilters } from 'pages/_app'
import { useMemo } from 'react'
import { dataFilters } from 'utils/cookies'

export function useExtraTvlsEnabled() {
  const { tvlFilters } = useTvlFilters()

  return useMemo(() => {
    const data = {}

    for (const [key, value] of Object.entries(tvlFilters)) {
      data[dataFilters[key] || key] = value
    }

    return data
  }, [tvlFilters])
}
