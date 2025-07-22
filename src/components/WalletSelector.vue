<template>
  <div class="wallet-selector">
    <div class="background-highlight" :style="highlightStyle"></div>
    <div
      v-for="(item, index) in walletItems"
      :key="index"
      :class="['wallet-item', { 'wallet-item--active': selectedButton === index }]"
      @click="setSelectedButton(index)"
    >
      {{ item }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch, nextTick } from 'vue'

export default defineComponent({
  name: 'WalletSelector',
  emits: ['walletChange'],
  setup(_, { emit }) {
    const walletItems = ref(['Встроенный', 'Внешний'])
    const selectedButton = ref(0)
    const highlightStyle = ref({})

    const updateHighlightStyle = async () => {
      await nextTick()
      const activeItem = document.querySelector('.wallet-item--active') as HTMLElement
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
      emit('walletChange', index === 0 ? 'internal' : 'external')
    }

    return { walletItems, selectedButton, setSelectedButton, highlightStyle }
  },
})
</script>

<style scoped>
.wallet-selector {
  justify-content: space-between;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  position: relative;
  display: flex;
  gap: 0;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 10px;
}

.wallet-item {
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

.wallet-item--active {
  color: #04a2fd;
}

.background-highlight {
  position: absolute;
  height: 36px;
  background-color: #1e2949;
  border-radius: 12px;
  transition:
    left 0.5s,
    width 0.5s;
  z-index: 0;
}
</style>
