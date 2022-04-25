import { useEffect } from 'react'
import { useRouter } from 'next/router'
import * as Fathom from 'fathom-client'
import LocalStorageContextProvider, { Updater as LocalStorageContextUpdater } from '../contexts/LocalStorage'

import create from 'zustand'
import createContext from 'zustand/context'

export const { Provider, useStore: useTvlFilters } = createContext()

function App({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    Fathom.load('OANJVQNZ', {
      includedDomains: ['defillama.com', 'www.defillama.com'],
      url: 'https://gold-six.llama.fi/script.js',
    })

    function onRouteChangeComplete() {
      Fathom.trackPageview()
    }
    // Record a pageview when route changes
    router.events.on('routeChangeComplete', onRouteChangeComplete)

    // Unassign event listener
    return () => {
      router.events.off('routeChangeComplete', onRouteChangeComplete)
    }
  })

  return (
    <Provider
      createStore={() =>
        create((set) => ({
          tvlFilters: pageProps.filters || {},
          updateTvlOption: (key, value) => set((state) => ({ tvlFilters: { ...state.tvlFilters, [key]: value } })),
        }))
      }
    >
      <LocalStorageContextProvider>
        <LocalStorageContextUpdater />
        <Component {...pageProps} />
      </LocalStorageContextProvider>
    </Provider>
  )
}

export default App
