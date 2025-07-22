import { defineStore } from 'pinia'
import type { Currency, ExchangeRate } from '@/types/currency'

interface CurrencyState {
  currencies: Currency[]
  exchangeRates: Record<string, number>
  loading: boolean
  error: string | null
}

export const useCurrencyStore = defineStore('currency', {
  state: (): CurrencyState => ({
    currencies: [
      {
        code: 'ETH',
        name: 'Ethereum',
        iconUrl: '/src/assets/icons/eth_logo_del.png',
        limits: { min: 0.01, max: 100 },
      },
      {
        code: 'TON',
        name: 'Toncoin',
        iconUrl: '/src/assets/icons/ton.png',
        limits: { min: 10, max: 100000 },
      },
      {
        code: 'RUB',
        name: 'Рубль',
        iconUrl: '/src/assets/icons/ruble.png',
        limits: { min: 1000, max: 1000000 },
      },
    ],
    exchangeRates: {
      'ETH-RUB': 250000,
      'ETH-TON': 533.108,
      'TON-RUB': 468.52,
      'TON-ETH': 0.001875,
    },
    loading: false,
    error: null,
  }),

  getters: {
    getCurrency: (state) => (code: string) => {
      return state.currencies.find((c) => c.code === code)
    },

    getIconUrl: (state) => (code: string) => {
      return state.currencies.find((c) => c.code === code)?.iconUrl || ''
    },
  },
})
