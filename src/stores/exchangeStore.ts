import { defineStore } from 'pinia'
import { ref } from 'vue'

// Типы для банков и валют
export interface Coin {
  name: string
  icon: string
  short_name: string
}

export interface Bank {
  name: string
  icon: string
  api_name: string
}

export const useExchangeStore = defineStore('exchange', () => {
  // Банки
  const banks = ref<Bank[]>([
    {
      name: 'СБЕР',
      icon: new URL('../assets/icons/banks/sber.png', import.meta.url).href,
      api_name: 'sberbank',
    },
    {
      name: 'Т-Банк',
      icon: new URL('../assets/icons/banks/tbank.png', import.meta.url).href,
      api_name: 'tbank',
    },
  ])

  // Криптовалюты
  const coins = ref<Coin[]>([
    {
      name: 'Bitcoin',
      icon: 'https://www.svgrepo.com/show/366911/btc.svg',
      short_name: 'BTC',
    },
  ])

  // Селекторы
  const selectedBank = ref<Bank>(banks.value[0])
  const selectedCoin = ref<Coin>(coins.value[0])

  // Методы для изменения выбранных значений
  const selectBank = (bank: Bank) => {
    selectedBank.value = bank
  }

  const selectCoin = (coin: Coin) => {
    selectedCoin.value = coin
  }

  return {
    banks,
    coins,
    selectedBank,
    selectedCoin,
    selectBank,
    selectCoin,
  }
})
