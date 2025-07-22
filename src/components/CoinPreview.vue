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
          <span>{{ coin.price }}</span>
          <span>&nbsp;</span>
          <span>{{ coin.short_name }}</span>
        </div>
      </div>
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
        price: string
        short_name: string
      }>,
      required: true,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
  },
})
</script>

<style scoped>
.coin-wrapper {
  display: flex;
  align-items: center;
  padding: 12px;
  background-color: #1e2949;
  border-radius: 12px;
  margin-top: 8px;
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
.coin-change.positive {
  color: #2ce99a;
}

.coin-change.negative {
  color: #e34040;
}

.coin-preview {
  /* существующие стили */

  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>
