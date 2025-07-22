<template>
  <div class="transaction-wrapper">
    <div class="data-container">
      <div class="transaction-header">
        <h1 @click="copyHashId">{{ transaction?.hashid }}</h1>
      </div>

      <div class="transaction-meta">
        <div class="field-block">
          <div class="field-value">{{ transaction?.card_number }}</div>
        </div>
        <div class="field-block">
          <div class="field-value">{{ transaction?.card_name }}</div>
        </div>
        <div class="field-block">
          <div class="field-value">{{ transaction?.bank_name }}</div>
        </div>

        <div class="field-block">
          <div class="field-value">{{ formatDate(transaction?.created_at) }}</div>
        </div>

        <div class="field-block">
          <div class="field-value">
            {{
              transaction?.typeBTC_name == 'Покупка'
                ? formatRubles(transaction?.summ)
                : `${transaction.BTC_summ} BTC`
            }}
          </div>
        </div>
      </div>

      <div class="amount-wrapper">
        <Divider />
        <span
          >Итого:
          {{
            transaction?.typeBTC_name == 'Покупка'
              ? `${transaction.BTC_summ} BTC`
              : formatRubles(transaction?.summ)
          }}</span
        >
      </div>
    </div>
    <button
      class="submit-button"
      @click="
        () => {
          nav.openTelegramLink('https://t.me/ObmenTochkaHelpBot')
        }
      "
    >
      Написать в поддержку
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, inject, onBeforeMount } from 'vue'

import { useWebAppBackButton } from 'vue-tg'
import router from '@/router'
import type { APITransaction } from '@/types/transaction'
import { useRoute } from 'vue-router'

import Divider from '@/components/Divider.vue'

import { useWebAppNavigation } from 'vue-tg'
const btn = useWebAppBackButton()

const nav = useWebAppNavigation()

const axios = inject('axios')
const user = inject('user')
const route = useRoute()

const transaction = ref<APITransaction | null>(null)

console.dir(route)

const getTransaction = async () => {
  try {
    const response = await axios.get<APITransaction>(`/user/get_transaction/${route.params.id}/`, {
      params: { user_id: user.data.user_id },
    })

    transaction.value = response.data
  } catch (error) {
    console.error('Error occurred while fetching transactions:', error)
  }
}

const copyHashId = () => {
  navigator.clipboard.writeText(transaction.value!.hashid)
}

const formatRubles = (amount: string | number) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount))
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }
  // Форматируем дату и заменяем запятую на "в"
  return date.toLocaleString('ru-RU', options).replace(',', ' в')
}

onBeforeMount(async () => {
  await getTransaction()
})
onMounted(() => {
  btn.showBackButton()
})

onUnmounted(() => {
  btn.hideBackButton()
})

btn.onBackButtonClicked(() => {
  router.push('/')
})
</script>

<style lang="postcss" scoped>
.data-container {
  display: flex;
  flex-direction: column;
}
.transaction-meta {
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  gap: 17px;
}
.transaction-wrapper {
  height: 100vh;
  justify-content: space-between;
  padding: 18px;
  display: flex;
  flex-direction: column;
}

.amount-wrapper {
  margin-top: 60px;
  display: flex;
  line-height: 20px;
  flex-direction: column;
  gap: 25px;
  font-size: 28px;
  font-weight: 800;
}

.transaction-header {
  cursor: pointer;
  text-align: center;
  h1 {
    margin: 0;
    color: #04a2fd;
    font-family: 'SF Pro Display', sans-serif;
    font-weight: 900;
  }
}

.field-block {
  background: #1e2949;
  border-radius: 12px;
  padding: 18px;

  position: relative;
}

.submit-button {
  background: #04a2fd;
  border-radius: 12px;

  padding: 14px;
  margin-bottom: var(--safe-area-inset-bottom, 25px);
  color: white;
  border: none;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  font-family: 'SF Pro Display', sans-serif;
  margin-top: 20px;

  &:hover {
    background: #0389d6;
  }
  transition: background 0.2s ease;
}

.field-value {
  color: white;
  font-size: 16px;
  font-family: 'SF Pro Display', sans-serif;
  padding-right: 40px;
}
</style>
