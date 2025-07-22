<template>
  <div class="coin-wrapper">
    <img :src="coin.icon" alt="" class="coin-icon" />
    <div class="coin-info">
      <div class="coin-name">
        <span>{{ coin.name }}</span>
      </div>
      <div class="coin-balance">
        <span :class="{ 'blurred-element': isBlurred }">{{ coin.balance }}</span>
        <span>&nbsp;</span>
        <span>{{ coin.coin_short_name }}</span>
      </div>
    </div>
    <div class="coin-price-wrapper">
      <div class="coin-price" :class="{ 'blurred-element': isBlurred }">
        <span>{{ formattedPrice }}</span>
        <span>&nbsp;</span>
        <span>₽</span>
      </div>
      <div :class="['coin-change', 'positive']">
        <CoinUp v-if="coin.change > 0" />
        <CoinDown v-else-if="coin.change < 0" />
        $0.00 (0.00%)
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import CoinUp from '@/assets/icons/coin/CoinUp.vue'
import CoinDown from '@/assets/icons/coin/CoinDown.vue'

export default defineComponent({
  name: 'CoinItem',
  components: { CoinDown, CoinUp },
  props: {
    coin: {
      type: Object as PropType<{
        name: string
        icon: string
        balance: number
        coin_short_name: string
        price: number
        change: 2.53
      }>,
      required: true,
    },
    isBlurred: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  computed: {
    formattedPrice() {
      return this.coin.price.toFixed(2)
    },
    changeIcon() {
      return this.coin.change > 0 ? 'CoinUp' : 'CoinDown'
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
</style>
