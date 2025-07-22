<template>
  <div class="timeframe-selector">
    <div class="timeframe-background-highlight" :style="highlightStyle"></div>
    <div
      v-for="(item, index) in displayItems"
      :key="index"
      :class="['timeframe-item', { 'timeframe-item--active': selectedButton === index }]"
      @click="setSelectedButton(index)"
    >
      {{ item }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick, defineEmits } from 'vue'

const emit = defineEmits(['timeChanged'])

const selectedButton = ref(0)
const highlightStyle = ref({})

import { useWebAppHapticFeedback } from 'vue-tg'

const { impactOccurred } = useWebAppHapticFeedback()

// Отображаемые значения
const displayItems = ref(['М5', 'Ч1', 'Ч4', 'Ч12', 'Д'])

// Маппинг для API OKX
const apiMapping: Record<string, string> = {
  М5: '5m',
  Ч1: '1H',
  Ч4: '4H',
  Ч12: '12H',
  Д: '1D',
}

const updateHighlightStyle = async () => {
  await nextTick()
  const activeItem = document.querySelector('.timeframe-item--active') as HTMLElement
  if (activeItem) {
    highlightStyle.value = {
      width: `${activeItem.offsetWidth}px`,
      left: `${activeItem.offsetLeft}px`,
    }
  }
}

watch(selectedButton, updateHighlightStyle)
onMounted(updateHighlightStyle)

const setSelectedButton = (index: number) => {
  selectedButton.value = index
  // Конвертируем отображаемое значение в значение для API
  const displayValue = displayItems.value[index]
  const apiValue = apiMapping[displayValue]
  impactOccurred('light')
  emit('timeChanged', apiValue)
}
</script>

<style scoped>
.timeframe-selector {
  user-select: none;
  background-color: #1e2949;
  justify-content: space-between;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  margin-top: 12px;
  display: flex;
  gap: 0;
  border-radius: 12px;
  overflow: hidden;
}

.timeframe-item {
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 12px;
  text-align: center;
  cursor: pointer;
  color: white;
  padding: 0 12px;
  height: 36px;
  border-radius: 12px;
  z-index: 1;
  transition: color 0.5s;
}

.timeframe-item--active {
  -webkit-tap-highlight-color: transparent;
  color: #04a2fd;
}

.timeframe-background-highlight {
  -webkit-tap-highlight-color: transparent;
  position: absolute;
  height: 36px;
  background-color: #152040;
  border-radius: 12px;
  transition:
    left 0.5s,
    width 0.5s;
  z-index: 0;
}
</style>
