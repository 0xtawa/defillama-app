import Cookies from 'js-cookie'

export const dataFilters = {
  STAKING: 'staking',
  POOL2: 'pool2',
  BORROWS: 'borrows',
  NODOUBLECOUNT: 'noDoubleCount',
} as const

type Keys = keyof typeof dataFilters
type Values = typeof dataFilters[Keys]

export const setCookie = (cookie: Values, value: 'true' | 'false') => {
  Cookies.set(cookie, value, { expires: 30 * 24 * 60 * 60 * 1000 }) // 1 month
}
