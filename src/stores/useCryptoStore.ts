import { defineStore } from 'pinia'
import { ref, onUnmounted, effectScope, onMounted } from 'vue'
import axios from 'axios'

type OKXCandleArray = [
  string, // ts: время в миллисекундах
  string, // o: цена открытия
  string, // h: максимальная цена
  string, // l: минимальная цена
  string, // c: цена закрытия
  string, // vol: объем торгов
  string, // volCcy: объем в базовой валюте
  string, // volCcyQuote: объем в котируемой валюте
  string, // confirm: состояние свечи
]

interface OKXResponse<T> {
  code: string
  msg: string
  data: T[]
}

interface OKXTickerData {
  instType: string
  instId: string
  last: string // Последняя цена
  lastSz: string // Объем последней сделки
  askPx: string // Лучшая цена продажи
  askSz: string // Объем по лучшей цене продажи
  bidPx: string // Лучшая цена покупки
  bidSz: string // Объем по лучшей цене покупки
  open24h: string // Цена открытия за 24ч
  high24h: string // Максимум за 24ч
  low24h: string // Минимум за 24ч
  volCcy24h: string // Объем торгов в валюте за 24ч
  vol24h: string // Объем торгов в контрактах за 24ч
  sodUtc0: string // Цена открытия UTC 0
  sodUtc8: string // Цена открытия UTC 8
  ts: string // Временная метка
}

interface ParsedCandle {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume: number
  volumeInCurrency: number
  volumeInQuoteCurrency: number
  isCompleted: boolean
}

const parseOKXCandle = (candle: OKXCandleArray): ParsedCandle => {
  return {
    timestamp: parseInt(candle[0]),
    open: parseFloat(candle[1]),
    high: parseFloat(candle[2]),
    low: parseFloat(candle[3]),
    close: parseFloat(candle[4]),
    volume: parseFloat(candle[5]),
    volumeInCurrency: parseFloat(candle[6]),
    volumeInQuoteCurrency: parseFloat(candle[7]),
    isCompleted: candle[8] !== '0',
  }
}

const formatPrice = (price: number): string => {
  return (
    '$' +
    new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price)
  )
}

// Интервалы для OKX API
const TIME_INTERVALS = {
  М5: '5m',
  Ч1: '1H',
  Ч4: '4H',
  Ч12: '12H',
  Д: '1D',
} as const

export type TimeFrameKey = keyof typeof TIME_INTERVALS

export const useCryptoStore = defineStore('crypto', () => {
  const currentData = ref<ParsedCandle[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const isPriceLoading = ref<boolean>(false)
  const currentPrice = ref<number | null>(null)
  const priceChange24h = ref<number | null>(null)
  const priceChangePercent24h = ref<number | null>(null)
  const chartLoading = ref(false)

  // Текущий выбранный временной интервал
  const selectedTimeFrame = ref<TimeFrameKey>('5m')

  // Количество свечей для разных интервалов

  // Функция получения данных
  const fetchCandleData = async () => {
    try {
      chartLoading.value = true
      error.value = null

      const response = await axios.get<OKXResponse<OKXCandleArray>>(
        `https://www.okx.com/api/v5/market/candles?instId=BTC-USDT&bar=${selectedTimeFrame.value}`,
      )

      if (response.data.code === '0') {
        currentData.value = response.data.data.map(parseOKXCandle).reverse()
      } else {
        throw new Error(response.data.msg)
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Ошибка загрузки данных'
    } finally {
      chartLoading.value = false
    }
  }

  const fetchCurrentPrice = async () => {
    console.trace('fetchCurrentPrice called')
    try {
      isPriceLoading.value = true
      const response = await axios.get<OKXResponse<OKXTickerData>>(
        'https://www.okx.com/api/v5/market/ticker?instId=BTC-USDT',
      )

      if (response.data.code === '0' && response.data.data.length > 0) {
        const ticker = response.data.data[0]
        currentPrice.value = parseFloat(ticker.last)

        // Расчет изменения цены
        const open24h = parseFloat(ticker.open24h)
        const last = parseFloat(ticker.last)
        priceChange24h.value = last - open24h
        priceChangePercent24h.value = ((last - open24h) / open24h) * 100
      }
    } catch (e) {
      console.error('Ошибка получения текущей цены:', e)
    } finally {
      isPriceLoading.value = false
    }
  }

  // Функция запуска автообновления

  // Функция остановки автообновления

  // Функция изменения временного интервала
  const setTimeFrame = async (timeFrame: TimeFrameKey) => {
    if (selectedTimeFrame.value === timeFrame) return
    console.log('Store: setTimeFrame called with:', timeFrame)
    selectedTimeFrame.value = timeFrame
    await fetchCandleData()
  }

  // Создаем scope для эффектов

  return {
    currentData,
    currentPrice,
    priceChange24h,
    priceChangePercent24h,
    isLoading,
    error,
    selectedTimeFrame,
    isPriceLoading,
    chartLoading,
    setTimeFrame,
    fetchCandleData,
    fetchCurrentPrice,
    formatPrice,
  }
})
