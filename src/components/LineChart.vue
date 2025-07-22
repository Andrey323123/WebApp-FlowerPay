<template>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, defineProps, defineEmits } from 'vue'
import {
  Chart,
  PointElement,
  registerables,
  type ActiveDataPoint,
  type ActiveElement,
} from 'chart.js'
import { useCryptoStore } from '@/stores/useCryptoStore'
import type { TimeFrameKey } from '@/stores/useCryptoStore'

Chart.register(...registerables)

const props = defineProps<{
  selectedTime: string
}>()

// Добавляем поддержку эмитов
const emit = defineEmits(['priceHovered', 'priceHoverEnd'])

const chartCanvas = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

const cryptoStore = useCryptoStore()

// Обновляем createChart
const createChart = async (timeframe: string) => {
  if (!chartCanvas.value) return
  const ctx = chartCanvas.value.getContext('2d')
  if (!ctx) return

  await cryptoStore.setTimeFrame(timeframe as TimeFrameKey)

  const data = cryptoStore.currentData

  const prices = data.map((d) => d.close)
  const timestamps = data.map((d) => d.timestamp)

  // Находим максимальную и минимальную цены
  const maxPrice = Math.max(...prices)
  const minPrice = Math.min(...prices)
  const maxIndex = prices.indexOf(maxPrice)
  const minIndex = prices.indexOf(minPrice)

  // Определяем изменение цены за период
  const priceChange = prices[prices.length - 1] - prices[0]
  const lineColor = priceChange >= 0 ? '#2ce99a' : '#ff5449'

  if (chartInstance) {
    chartInstance.destroy()
  }

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: timestamps,
      datasets: [
        {
          data: prices,
          borderColor: lineColor,
          borderWidth: 3,
          tension: 0.4,
          fill: false,
          pointRadius: 0,
          pointHoverRadius: 0,
        },
      ],
    },
    options: {
      layout: {
        padding: {
          top: 20,
          right: 0,
          bottom: 30,
          left: 30,
        },
      },
      scales: {
        x: {
          display: false,
          grid: {
            display: false,
          },
        },
        y: {
          grid: {
            display: false,
          },
          ticks: {
            color: '#8a8e9d',

            count: () => {
              if (timeframe == '5m') {
                return 5
              }
              return 4
            },
            font: {
              family: 'Inter',
              size: 12,
            },
            callback: (value) => {
              if (timeframe == '5m') {
                return (
                  '$' +
                  new Intl.NumberFormat('en-US', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 4,
                  }).format(value)
                )
              }
              return (
                '$' +
                new Intl.NumberFormat('en-US', {
                  notation: 'compact',
                  compactDisplay: 'short',
                }).format(value)
              )
            },
          },
          display: 'auto',
          position: 'right',
        },
      },
      maintainAspectRatio: false,
      responsive: true,
      interaction: {
        intersect: false,
        mode: 'index',
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: false,
          external: (context) => {
            const tooltip = context.tooltip
            if (tooltip.opacity === 0) {
              emit('priceHoverEnd')
              return
            }
            if (tooltip.dataPoints?.length) {
              const price = tooltip.dataPoints[0].raw as number
              emit('priceHovered', price)
            }
          },
        },
      },
    },
    plugins: [
      {
        id: 'customLine',
        afterDraw: (chart) => {
          if (chart.tooltip?._active?.length) {
            const activeElement = chart.tooltip._active[0]
            const {
              ctx,
              chartArea: { top, bottom },
            } = chart
            const x = activeElement.element.x
            // Рисуем белую dashed‑линию
            ctx.save()
            ctx.setLineDash([5, 5])
            ctx.beginPath()
            ctx.moveTo(x, top)
            ctx.lineTo(x, bottom)
            ctx.lineWidth = 2

            ctx.strokeStyle = '#ffffff'
            ctx.stroke()
            ctx.restore()

            const activeIndex = activeElement.index
            const timeValue = chart.data.labels[activeIndex] as string

            // Форматируем дату
            const dateObj = new Date(timeValue)
            const today = new Date()
            let formattedDate = ''

            if (dateObj.toDateString() === today.toDateString()) {
              // Если дата сегодняшняя – выводим только часы и минуты
              formattedDate = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            } else {
              // Формируем опции для форматирования даты
              let options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit' }
              // Добавляем год, если год выбранной даты не равен текущему
              if (dateObj.getFullYear() !== today.getFullYear()) {
                options.year = 'numeric'
              }
              const datePart = dateObj.toLocaleDateString([], options)
              const timePart = dateObj.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })
              formattedDate = `${datePart} ${timePart}`
            }
            const priceValue = activeElement.element.$context.parsed.y
            if (priceValue !== undefined && priceValue !== null) {
              ctx.save()
              ctx.fillStyle = '#ffffff'
              ctx.font = '12px Inter'
              ctx.textAlign = 'left'
              // Располагаем текст над точкой активного элемента (с активной y координатой)
              const labelY = top - 10

              let align = ''
              if (activeElement.index < 10 && timeframe != '5m') {
                align = 'left'
              } else {
                align = 'center'
              }
              ctx.textAlign = align as CanvasTextAlign
              ctx.fillText(formattedDate, x, labelY)
              ctx.restore()
            }
          }
        },
      },
      {
        id: 'extremumLabels',
        afterDatasetsDraw: (chart) => {
          const { ctx } = chart
          ctx.save()
          ctx.fillStyle = '#A3A3A3'
          ctx.font = '12px Inter'
          ctx.textAlign = 'center'

          // Получаем элементы набора данных для максимума и минимума
          const meta = chart.getDatasetMeta(0).data
          const maxPoint = meta[maxIndex]
          const minPoint = meta[minIndex]

          // Вычисляем смещения (настройте по необходимости)
          const maxOffset = 12 // метка над точкой максимума
          const minOffset = -16 // метка над точкой минимума

          // Рисуем надписи над точками
          ctx.fillText(cryptoStore.formatPrice(maxPrice), maxPoint.x, maxPoint.y - maxOffset)
          ctx.fillText(cryptoStore.formatPrice(minPrice), minPoint.x, minPoint.y - minOffset)

          ctx.restore()
        },
      },
    ],
  })
}

// Следим за изменением выбранного времени
watch(
  () => props.selectedTime,
  async (newTime, oldTime) => {
    if (newTime !== oldTime) {
      await createChart(newTime)
    }
  },
  { immediate: true },
)

onMounted(() => {
  createChart(props.selectedTime)

  if (chartCanvas.value) {
    // Для блокировки вертикальных свайпов
    chartCanvas.value.addEventListener(
      'touchmove',
      (e) => {
        e.preventDefault()
      },
      { passive: false },
    )

    chartCanvas.value.addEventListener('mouseleave', () => {
      emit('priceHoverEnd')
    })

    const resetCrosshair = () => {
      if (chartInstance) {
        chartInstance.tooltip.setActiveElements([], { x: 0, y: 0 })

        chartInstance.update('none')
      }
      emit('priceHoverEnd')
    }
    chartCanvas.value.addEventListener('pointerleave', resetCrosshair)
    chartCanvas.value.addEventListener('touchend', resetCrosshair)
    chartCanvas.value.addEventListener('touchcancel', resetCrosshair)
  }
})
</script>

<style scoped>
.chart-container {
  position: relative;
  box-sizing: border-box;
  height: 370px;
  min-height: 370px;
  width: 100%;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
  touch-action: none;
}

canvas {
  width: 100% !important;
  height: 100% !important;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
}
</style>
