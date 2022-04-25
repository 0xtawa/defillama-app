import { dataFilters } from 'utils/cookies'
import ChainPage from '../../components/ChainPage'
import { GeneralLayout } from '../../layout'
import { getChainPageData } from '../../utils/dataApi'

export default function Chain({ chain, ...props }) {
  return (
    <GeneralLayout title={`${chain} TVL - DefiLlama`}>
      <ChainPage {...props} selectedChain={chain} />
    </GeneralLayout>
  )
}

export async function getServerSideProps({ req, res, query }) {
  const filters = {}

  for (const key of Object.keys(dataFilters)) {
    filters[key] = req.cookies[key] === 'true' ? true : false
  }

  const { props } = await getChainPageData(query?.chain ?? '')

  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')

  return {
    props: {
      ...props,
      filters,
    },
  }
}
