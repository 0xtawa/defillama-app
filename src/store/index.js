import { dataFilters } from 'utils/cookies'
import create from 'zustand'

const initialState = {}

Object.keys(dataFilters).forEach((filter) => (initialState[filter] = false))

export const useTvlOptions = create((set) => ({
  ...initialState,
  updateTvlOption: (key, value) => set((state) => ({ ...state, [key]: value })),
  setOptions: (values) => set(() => ({ ...values })),
}))
