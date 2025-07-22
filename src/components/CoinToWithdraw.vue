<template>
  <div
    class="coin-preview"
    :class="{ 'coin-preview--disabled': isDisabled }"
    @click="!isDisabled && $emit('click')"
  >
    <div class="coin-wrapper">
      <img :src="coin.icon" alt="" class="coin-icon" />
      <div class="coin-info">
        <div class="coin-name">
          <span>{{ coin.name }}</span>
        </div>
        <div class="coin-balance">
          <span>{{ coin.available }}</span>
          <span>&nbsp;</span>
          <span>{{ coin.short_name }}</span>
        </div>
      </div>
      <span class="coin-withdraw-available">{{ formattedPrice }} $</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'

export default defineComponent({
  name: 'CoinPreview',
  props: {
    coin: {
      type: Object as PropType<{
        name: string
        icon: string
        available: number
        p_converted: number
        short_name: string
      }>,
      required: true,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    formattedPrice() {
      console.log(this.coin.p_converted)
      return this.coin.p_converted.toFixed(2)
    },
  },
})
</script>

<style scoped>
.coin-withdraw-available {
  font-weight: 400;
  font-size: 16px;
}
.coin-wrapper {
  box-sizing: border-box;
  cursor: pointer;
  font-family: 'SF Pro Display', sans-serif;
  display: flex;
  align-items: center;
  padding: 8px;
  background-color: #1e2949;
  border-radius: 12px;
}

.coin-icon {
  width: 48px;
  aspect-ratio: 1;
}

.coin-info {
  margin-left: 12px;
  flex-grow: 1;
}

.coin-name {
  font-size: 18px;
  font-family: 'SF Pro Display', sans-serif;
  font-weight: 600;
  color: white;
}

.coin-balance {
  font-family: 'SF Pro Display', sans-serif;
  font-weight: 400;
  font-size: 14px;
  color: #b1c1d2;
}

.coin-price {
  font-family: 'SF Pro Display', sans-serif;
  font-weight: 400;
  font-size: 16px;
  color: white;
}

.coin-price-wrapper {
  text-align: right;
}

.coin-change {
  font-family: 'SF Pro Display', sans-serif;
  font-weight: 500;
  font-size: 12px;
}

.coin-preview {
  /* существующие стили */

  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>
