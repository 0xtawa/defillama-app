import NFTDashboardPage from '../../../components/NFTDashboardPage'
import {
  getNFTMarketplaceChartData,
  getNFTMarketplacesData,
  getNFTCollectionsByMarketplace,
  getNFTStatistics,
  revalidate,
} from '../../../utils/dataApi'

export async function getStaticProps({
  params: {
    marketplace: [marketplaceName],
  },
}) {
  const collections = await getNFTCollectionsByMarketplace(marketplaceName)
  const chartData = await getNFTMarketplaceChartData(marketplaceName)
  const marketplaceData = await getNFTMarketplacesData()
  const statistics = await getNFTStatistics(chartData)
  const { displayName } = marketplaceData.find((c) => c.marketplace === marketplaceName) || { displayName: '' }

  return {
    props: {
      chart: chartData,
      collections,
      statistics,
      marketplaceData,
      displayName,
    },
    revalidate: revalidate(),
  }
}

export async function getStaticPaths() {
  const marketplaceData = await getNFTMarketplacesData()

  const paths = marketplaceData.slice(0, 5).map(({ marketplace: marketplaceName }) => ({
    params: { marketplace: [marketplaceName] },
  }))

  return { paths, fallback: 'blocking' }
}

export default function Marketplace({ displayName, ...props }) {
  return <NFTDashboardPage title={`${displayName} Total Volume - DefiLlama`} displayName={displayName} {...props} />
}
