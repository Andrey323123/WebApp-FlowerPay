<template>
  <div class="withdraw-coins">
    <div class="withdraw-coins__list">
      <CoinToWithdraw
        v-for="coin in coins"
        :key="coin.short_name"
        :coin="coin"
        @click="handleCoinSelect(coin.short_name)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, onBeforeMount, computed } from 'vue'
import { useRouter } from 'vue-router'
import CoinToWithdraw from '@/components/CoinToWithdraw.vue'
import { useNavbarControl } from '@/composables/useNavbarControl'
import btc_log from '@/assets/icons/btc_log.png'
import { useWebAppBackButton } from 'vue-tg'
import type { User } from '@/types/user'
const router = useRouter()

const handleCoinSelect = (coinType: string) => {
  router.push(`/withdraw-coin/${coinType.toLowerCase()}`)
}

const btn = useWebAppBackButton()

const axios = inject('axios')

const user = inject<User>('user')

const btcBalance = ref(0)
const btcPrice = ref(0.0)
const getBTC = async () => {
  try {
    const response = await axios.get('/btc/balance/', {
      params: { user_id: user.data.user_id },
    })
    btcBalance.value = response.data.balance
  } catch (error) {
    console.error('Error occurred:', error)
  }
}

const getBTCCost = async () => {
  try {
    const response = await axios.get('/btc/cost/')
    console.log(response.data)

    btcPrice.value = response.data.cost
  } catch (error) {
    console.error('Error occurred:', error)
  }
}

onBeforeMount(async () => {
  await getBTC()
  await getBTCCost()
})

const drochuHui = computed(() => {
  return btcBalance.value * btcPrice.value
})

const coins = ref([
  {
    name: 'Bitcoin',
    icon: btc_log,
    short_name: 'BTC',
    available: btcBalance,
    p_converted: drochuHui,
  },
])

if (!btn.isBackButtonVisible) {
  btn.showBackButton()
}

btn.onBackButtonClicked(() => {
  router.back()
})

useNavbarControl()
</script>

<style lang="postcss" scoped>
.withdraw-coins {
  padding: 18px;

  &__title {
    font-size: 24px;
    font-weight: bold;
    color: white;
    margin-bottom: 24px;
    font-family: 'SF Pro Display', sans-serif;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}
</style>
