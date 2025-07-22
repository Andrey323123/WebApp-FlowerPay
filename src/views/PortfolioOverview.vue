<template>
  <div class="portfolio-overview">
    <div class="portfolio-overview__header">
      <div class="portfolio-overview__title-container">
        <span class="portfolio-overview__title-text">Обзор портфеля</span>
        <span class="portfolio-overview__currency">RUB</span>
      </div>
      <div class="portfolio-overview__header__icon-wrapper">
        <router-link to="/deposit">
          <DepositIcon class="portfolio-overview__header__icon" />
        </router-link>
        <router-link to="/withdraw">
          <SendIcon class="portfolio-overview__header__icon" />
        </router-link>
      </div>
    </div>

    <div class="portfolio-overview__portfolio-summary">
      <div
        class="portfolio-overview__portfolio-summary__money-amount"
        :class="{ 'blurred-element': isBlurred }"
      >
        <span>{{ formattedBalance.whole }}</span>
        <span>,</span>
        <span class="portfolio-overview__portfolio-summary__cents">{{
          formattedBalance.fraction
        }}</span>
        <span>&nbsp;</span>
        <span class="portfolio-overview__portfolio-summary__currency_sign">₽</span>
      </div>
      <div class="portfolio-overview__wallet-change">
        <CoinUp :class="{ 'blurred-element': isBlurred }" />
        <span :class="{ 'blurred-element': isBlurred }">$</span>
        <span :class="{ 'blurred-element': isBlurred }">0.00</span>
        <span :class="{ 'blurred-element': isBlurred }">(0%)</span>
        <span class="portfolio-overview__time">сегодня</span>
      </div>
    </div>

    <div class="portfolio-overview__section coins-section">
      <div class="portfolio-overview__section-header">
        <span>Монеты</span>
        <a href="#">Все</a>
      </div>
      <div class="portfolio-overview__coins-container">
        <CoinItem
          v-for="(coin, index) in coins"
          :key="coin.name"
          :coin="coin"
          :is-first="index === 0"
          :is-blurred="isBlurred"
        />
      </div>
    </div>

    <div class="portfolio-overview__content-wrapper">
      <div class="portfolio-overview__section transactions-section">
        <div class="portfolio-overview__section-header">
          <span>Транзакции</span>
          <a @click="router.push('/transactions')">Все</a>
        </div>
        <TransactionItem
          v-for="transaction in transactionsToShow"
          :key="transaction.id"
          :transaction="transaction"
          :is-blurred="isBlurred"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject, onBeforeMount, onMounted } from 'vue'
import { useWebAppViewport } from 'vue-tg'
import btc_icon from '@/assets/icons/bitcoin.png'
import CoinItem from '@/components/CoinItem.vue'
import TransactionItem from '@/components/TransactionItem.vue'
import CoinUp from '@/assets/icons/coin/CoinUp.vue'
import { useBlurStore } from '@/stores/walletVisibilityStore'
import type { User } from '@/types/user'
import DepositIcon from '@/assets/icons/DepositIcon.vue'
import SendIcon from '@/assets/icons/SendIcon.vue'

import { Popup, useWebAppPopup } from 'vue-tg'
import router from '@/router'
import type { APITransaction } from '@/types/transaction'
import { convertTransaction } from '@/composables/convertTransaction'

const viewport = useWebAppViewport()
viewport.enableVerticalSwipes()
const axios = inject('axios')

const { isBlurred } = useBlurStore()

const user = inject<User>('user')

const btcBalance = ref(0)
const btcPrice = ref(0.0)

const getTransactions = async () => {
  try {
    const response = await axios.get<APITransaction[]>('/user/get_transactions/', {
      params: {
        user_id: user.data.user_id,
        cursor: 1,
      },
    })

    transactions.value = response.data
  } catch (error) {
    console.error('Error occurred while fetching transactions:', error)
  }
}

const transactionsToShow = computed(() => transactions.value.slice(0, 2))

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

    btcPrice.value = response.data.rub_cost
  } catch (error) {
    console.error('Error occurred:', error)
  }
}

onMounted(async () => {
  await getTransactions()
})
onBeforeMount(async () => {
  await getBTC()
  await getBTCCost()
})

const formattedBalance = computed(() => {
  const balance = drochuHui.value
  const [whole, fraction = '00'] = parseFloat(balance).toFixed(2).split('.')
  return {
    whole,
    fraction: fraction.padEnd(2, '0'),
  }
})

const drochuHui = computed(() => {
  return btcBalance.value * btcPrice.value
})

const coins = ref([
  {
    name: 'Bitcoin',
    icon: btc_icon,
    balance: btcBalance,
    coin_short_name: 'BTC',
    price: drochuHui,
    change: 2.53,
    changeText: '0.00 (0.00%)',
  },
])

const transactions = ref([
  // {
  //   id: 1,
  //   type: 'send',
  //   icon: btc_icon,
  //   recipient: 'Wallet',
  //   date: 'Ноябрь 17 в 13:34',
  //   amount: '0.1 BTC',
  // },
])
</script>

<style scoped lang="postcss">
.portfolio-overview {
  display: flex;
  flex-direction: column;
  height: calc(100dvh - var(--safe-area-inset-bottom));
  padding: 18px;
  color: #b1c1d2;

  &__header {
    font-family: 'SF Pro Display', sans-serif;
    font-weight: 600;
    display: flex;
    margin-bottom: 31px;
    align-items: center;
    justify-content: space-between;
    flex-wrap: nowrap;
    color: #ffffff;

    &__icon-wrapper {
      display: flex;

      flex-direction: row;
      gap: 20px;
    }

    &__icon {
      box-sizing: content-box;
      border-radius: 16px;
      cursor: pointer;
      padding: 9px;
      background-color: #1e2949;
    }
  }

  &__title-container {
    display: flex;
    align-items: center;
    font-size: 18px;
  }

  &__title-text {
    margin-right: 6px;
  }

  &__currency {
    font-weight: bold;
    color: #04a2fd;
  }

  &__portfolio-summary {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'SFRounded', sans-serif;
    font-weight: 700;
    text-align: center;

    &__money-amount {
      color: white;
      font-size: 48px;
    }

    &__cents {
      font-size: 32px;
    }

    &__currency_sign {
      color: var(--secondary-text-color);
      font-size: 32px;
    }
  }

  &__wallet-change {
    font-family: 'SF Pro Display', sans-serif;
    font-weight: bold;
    color: var(--price-positive-change);
    font-size: 12px;

    &.positive {
      color: var(--price-positive-change);
    }

    &.negative {
      color: var(--price-negative-change);
    }

    & > :first-child {
      margin-right: 4px;
    }
  }

  &__section-header {
    font-family: 'SF Pro Display', sans-serif;
    color: #ffffff;
    display: flex;
    margin-bottom: 14px;
    line-height: 21px;
    font-weight: 600;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;

    a {
      color: #04a2fd !important;
      cursor: pointer;
    }
  }

  &__coins-container {
    background-color: #1e2949;
    border-radius: 8px;
    overflow: hidden;
  }

  &__time {
    color: #ffffff;
    opacity: 0.6;
    background-color: #1e2949;
    margin-left: 8px;
    padding: 5px 6px;
    border-radius: 8px;
  }

  &__cents {
    font-size: 32px;
  }

  &__section {
    margin-top: 24px;
  }

  &__section-header a {
    text-decoration: none;
    font-weight: 500;
    color: #b1c1d2;
    font-size: 14px;
  }

  &__content-wrapper {
    flex: 1;
    min-height: 0;
    position: relative;
  }

  &__section.transactions-section {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
}

.transactions-section {
  overflow-y: auto;
}
</style>
