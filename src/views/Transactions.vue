<template>
  <div class="transactions-wrapper">
    <TransactionItem
      v-for="transaction in transactions"
      :key="transaction.id"
      :is-blurred="blurStore.isBlurred"
      :transaction="transaction"
    />
    <div v-if="loading" class="loader">Загрузка...</div>
    <div ref="loadMoreTrigger"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, inject } from 'vue'
import TransactionItem from '@/components/TransactionItem.vue'
import { useWebAppBackButton } from 'vue-tg'
import router from '@/router'
import { useBlurStore } from '@/stores/walletVisibilityStore'
import type { APITransaction } from '@/types/transaction'

const blurStore = useBlurStore()

const axios = inject('axios')
const user = inject('user')

const transactions = ref<APITransaction[]>([])
const loading = ref(false)
const cursor = ref(1)
const hasMore = ref(true)
const loadMoreTrigger = ref<HTMLElement | null>(null)

// Observer должен быть объявлен вне `onMounted`
let observer: IntersectionObserver | null = null

const getTransactions = async () => {
  if (loading.value || !hasMore.value) return

  loading.value = true
  try {
    const response = await axios.get<APITransaction[]>('/user/get_transactions/', {
      params: { user_id: user.data.user_id, cursor: cursor.value },
    })

    const results = response.data

    if (results.length < 10) {
      hasMore.value = false
    }

    transactions.value.push(...results)
    cursor.value += 1
  } catch (error) {
    console.error('Error occurred while fetching transactions:', error)
  } finally {
    loading.value = false
  }
}

const btn = useWebAppBackButton()

onMounted(() => {
  btn.showBackButton()
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && hasMore.value && !loading.value) {
        getTransactions()
      }
    },
    { threshold: 0.1 },
  )

  if (loadMoreTrigger.value) {
    observer.observe(loadMoreTrigger.value)
  }

  getTransactions()
})

onUnmounted(() => {
  if (observer && loadMoreTrigger.value) {
    observer.unobserve(loadMoreTrigger.value)
  }
  observer = null
  btn.hideBackButton()
})

const openTransaction = (transaction: APITransaction) => {
  router.push({
    name: 'transaction',
    params: { id: transaction.id },
  })
}

btn.onBackButtonClicked(() => {
  router.push('/')
})
</script>

<style lang="postcss" scoped>
.transactions-wrapper {
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: calc(100vh - 120px);
  overflow-y: auto;
}

.loader {
  text-align: center;
  padding: 1rem;
  color: var(--secondary-text-color);
}
</style>
