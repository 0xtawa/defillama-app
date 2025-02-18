import React from 'react'
import styled from 'styled-components'
import { Sun, Moon } from 'react-feather'

const IconWrapper = styled.div<{ isActive?: boolean }>`
  opacity: ${({ isActive }) => (isActive ? 0.8 : 0.4)};

  :hover {
    opacity: 1;
  }
`

const StyledToggle = styled.button`
  display: none;
  width: fit-content;
  cursor: pointer;
  text-decoration: none;
  color: white;
  background: none;
  border: none;
  padding: 0;

  :hover {
    text-decoration: none;
  }

  :focus-visible {
    outline: ${({ theme }) => '1px solid ' + theme.white};
  }

  @media (min-width: ${({ theme: { bpLg } }) => bpLg}) {
    display: flex;
  }
`

export interface ToggleProps {
  isActive: boolean
  toggle: () => void
}

export default function Toggle({ isActive, toggle }: ToggleProps) {
  return (
    <StyledToggle onClick={toggle}>
      <span>
        <IconWrapper isActive={!isActive}>
          <Sun size={20} />
        </IconWrapper>
      </span>
      <span style={{ padding: '0 .5rem' }}>{' / '}</span>
      <span>
        <IconWrapper isActive={isActive}>
          <Moon size={20} />
        </IconWrapper>
      </span>
    </StyledToggle>
  )
}
