export type CurrencyCode = 'ETH' | 'TON' | 'RUB'

export interface Currency {
  code: CurrencyCode
  name: string
  iconUrl: string
  limits?: {
    min: number
    max: number
  }
}

export interface ExchangeRate {
  pair: string
  rate: number
}
