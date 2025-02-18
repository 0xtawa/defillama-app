import React, { useMemo } from 'react'
import { useCalcStakePool2Tvl } from 'hooks/data'
import { Header } from 'Theme'
import { ProtocolsChainsSearch } from 'components/Search/OpenSearch'
import Table, { columnsToShow } from 'components/Table'
import Filters, { FiltersWrapper } from 'components/Filters'

function AllTokensPage({
  title,
  category,
  selectedChain = 'All',
  chains = [],
  filteredProtocols,
  showChainList = true,
  defaultSortingColumn,
}) {
  const handleRouting = (chain) => {
    if (chain === 'All') return `/protocols/${category?.toLowerCase()}`
    return `/protocols/${category?.toLowerCase()}/${chain}`
  }
  const chainOptions = ['All', ...chains].map((label) => ({ label, to: handleRouting(label) }))

  const protocols = useMemo(() => {
    if (category === 'Lending') {
      return filteredProtocols.map((p) => {
        const bTvl = p.extraTvl?.borrowed?.tvl ?? null
        const msizetvl = bTvl ? (bTvl + p.tvl) / p.tvl : null
        return { ...p, msizetvl }
      })
    } else return filteredProtocols
  }, [filteredProtocols, category])

  const protocolTotals = useCalcStakePool2Tvl(protocols, defaultSortingColumn)

  if (!title) {
    title = `TVL Rankings`
    if (category) {
      title = `${category} TVL Rankings`
    }
  }

  const columns = useMemo(() => {
    if (category === 'Lending') {
      return columnsToShow('protocolName', 'chains', '1dChange', '7dChange', '1mChange', 'tvl', 'mcaptvl', 'msizetvl')
    } else return columnsToShow('protocolName', 'chains', '1dChange', '7dChange', '1mChange', 'tvl', 'mcaptvl')
  }, [category])

  const routeName = category ? (selectedChain === 'All' ? 'All Chains' : selectedChain) : 'All Protocols'

  return (
    <>
      <ProtocolsChainsSearch
        step={{
          category: category || 'Home',
          name: routeName,
          route: 'categories',
        }}
      />
      <Header>{title}</Header>

      {showChainList && (
        <FiltersWrapper>
          <Filters filterOptions={chainOptions} activeLabel={selectedChain} />
        </FiltersWrapper>
      )}

      <Table data={protocolTotals} columns={columns} />
    </>
  )
}

export default AllTokensPage
