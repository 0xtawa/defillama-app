import React from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import {
  useStakingManager,
  useDisplayUsdManager,
  useBorrowedManager,
  useHideLastDayManager,
  useStablecoinsManager,
  useSingleExposureManager,
  useNoILManager,
  useMillionDollarManager,
} from '../../contexts/LocalStorage'

import { AutoRow } from '../Row'
import { useIsClient } from 'hooks'
import OptionToggle from 'components/OptionToggle'
import * as ScrollArea from '@radix-ui/react-scroll-area'
import { setCookie } from 'utils/cookies'
import { useTvlOptions } from 'store'
import { useTvlFilters } from 'pages/_app'

const ScrollAreaRoot = styled(ScrollArea.Root)`
  width: 100%;
  overflow: hidden;
  color: white;
`

const ScrollAreaViewport = styled(ScrollArea.Viewport)`
  width: 100%;
  height: 100%;
`

const ScrollAreaScrollbar = styled(ScrollArea.Scrollbar)`
  display: flex;
  user-select: none;
  touch-action: none;
  padding: 2px;
  background: rgba(229, 231, 235);
  transition: background 160ms ease-out;
  &[data-orientation='vertical'] {
    width: 10px;
  }
  &[data-orientation='horizontal'] {
    flex-direction: column;
    height: 10px;
  }
`

const ScrollAreaThumb = styled(ScrollArea.Thumb)`
  flex: 1;
  background: rgba(163, 163, 163);
  border-radius: 10px;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    min-width: 44px;
    min-height: 44px;
  }
`

const ScrollAreaCorner = styled(ScrollArea.Corner)`
  background: (163, 163, 163);
`

const ListWrapper = styled.ul`
  display: flex;
  margin: 24px 0;
  padding: 0;
  list-style: none;
`
const ListItem = styled.li`
  &:not(:first-child) {
    margin-left: 12px;
  }
`

export function CheckMarks({ type = 'defi' }) {
  const [stakingEnabled, toggleStaking] = useStakingManager()
  const [borrowedEnabled, toggleBorrowed] = useBorrowedManager()
  const [displayUsd, toggleDisplayUsd] = useDisplayUsdManager()
  const [hideLastDay, toggleHideLastDay] = useHideLastDayManager()
  const [stablecoins, toggleStablecoins] = useStablecoinsManager()
  const [singleExposure, toggleSingleExposure] = useSingleExposureManager()
  const [noIL, toggleNoIL] = useNoILManager()
  const [millionDollar, toggleMillionDollar] = useMillionDollarManager()
  const router = useRouter()
  const isClient = useIsClient()

  const toggleSettings = {
    defi: [
      {
        name: 'Staking',
        toggle: toggleStaking,
        enabled: stakingEnabled && isClient,
        help: 'Include governance tokens staked in the protocol',
      },
      {
        name: 'Borrows',
        toggle: toggleBorrowed,
        enabled: borrowedEnabled && isClient,
        help: 'Include borrowed coins in lending protocols',
      },
    ],
    nfts: [
      router.pathname !== '/nfts' && {
        name: 'Display in USD',
        toggle: toggleDisplayUsd,
        enabled: displayUsd && isClient,
        help: 'Display metrics in USD',
      },
      {
        name: 'Hide last day',
        toggle: toggleHideLastDay,
        enabled: hideLastDay && isClient,
        help: 'Hide the last day of data',
      },
    ],
    yields: [
      {
        name: 'Stablecoins',
        toggle: toggleStablecoins,
        enabled: stablecoins && isClient,
        help: 'Select pools consisting of stablecoins only',
      },
      {
        name: 'Single Exposure',
        toggle: toggleSingleExposure,
        enabled: singleExposure && isClient,
        help: 'Select pools with single token exposure only',
      },
      {
        name: 'No IL',
        toggle: toggleNoIL,
        enabled: noIL && isClient,
        help: 'Select pools with no impermanent loss',
      },
      {
        name: 'Million Dollar',
        toggle: toggleMillionDollar,
        enabled: millionDollar && isClient,
        help: 'Select pools with at least one million dollar in TVL',
      },
    ],
  }

  return (
    <AutoRow gap="10px" justify="center" key="settings">
      {toggleSettings[type].map((toggleSetting) => {
        if (toggleSetting) {
          return <OptionToggle {...toggleSetting} key={toggleSetting.name} />
        } else return null
      })}
    </AutoRow>
  )
}

const extraTvlOptions = [
  {
    name: 'Staking',
    key: 'STAKING',
    help: 'Include governance tokens staked in the protocol',
  },
  {
    name: 'Pool2',
    key: 'POOL2',
    help: 'Include staked lp tokens where one of the coins in the pair is the governance token',
  },
  {
    name: 'Borrows',
    key: 'BORROWED',
    help: 'Include borrowed coins in lending protocols',
  },
  {
    name: 'Double Count',
    key: 'NODOUBLECOUNT',
    help: 'Double count TVL of certain protocols',
  },
]

export const AllTvlOptions = ({ style }) => {
  return (
    <>
      <ScrollAreaRoot>
        <ScrollAreaViewport>
          <ListWrapper style={{ ...style }}>
            {extraTvlOptions.map((option) => (
              <ListItem key={option.key}>
                <NewToggle option={option} />
              </ListItem>
            ))}
          </ListWrapper>
        </ScrollAreaViewport>
        <ScrollAreaScrollbar orientation="horizontal">
          <ScrollAreaThumb />
        </ScrollAreaScrollbar>
        <ScrollAreaCorner />
      </ScrollAreaRoot>
    </>
  )
}

const NewToggle = ({ option }) => {
  const { tvlFilters, updateTvlOption } = useTvlFilters()
  const isEnabled = tvlFilters[option.key]
  return (
    <OptionToggle
      {...option}
      toggle={() => {
        setCookie(option.key, isEnabled ? 'false' : 'true')
        updateTvlOption(option.key, !isEnabled)
      }}
      enabled={isEnabled}
    />
  )
}
