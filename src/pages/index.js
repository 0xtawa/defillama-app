import ChainPage from '../components/ChainPage'
import { GeneralLayout } from '../layout'
import { getChainPageData } from '../utils/dataApi'
import SearchDataProvider from 'contexts/SearchData'
import { dataFilters } from 'utils/cookies'

export default function HomePage(props) {
  return (
    <SearchDataProvider protocolsAndChains={{ protocolNames: props.filteredProtocols, chainsSet: props.chainsSet }}>
      <GeneralLayout title="DefiLlama - DeFi Dashboard">
        <ChainPage {...props} />
      </GeneralLayout>
    </SearchDataProvider>
  )
}

export async function getServerSideProps({ req }) {
  const filters = {}

  for (const key of Object.keys(dataFilters)) {
    filters[key] = req.cookies[key] === 'true' ? true : false
  }

  const { props } = await getChainPageData()

  return {
    props: {
      ...props,
      filters,
    },
  }
}
