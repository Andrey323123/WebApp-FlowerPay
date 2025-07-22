<template>
  <div class="transaction" @click="openTransaction">
    <SentIcon
      v-if="transaction.typeBTC_name === 'Продажа' && transaction.status_name == 'Подтверждена'"
      class="transaction-icon"
    />
    <ReceivedIcon
      v-if="transaction.typeBTC_name === 'Покупка' && transaction.status_name == 'Подтверждена'"
      class="transaction-icon"
    />
    <InProgress v-if="transaction.status_name == 'Обработка'" />
    <div class="transaction-info">
      <div class="transaction-text">
        <span v-if="transaction.typeBTC_name === 'Продажа'">Вывод средств</span>
        <span v-if="transaction.typeBTC_name === 'Покупка'">Пополнение средств</span>
      </div>
      <div class="transaction-date">{{ formatDate(transaction.created_at) }}</div>
    </div>
    <div class="amount-wrapper">
      <div class="transaction-amount" :class="{ 'blurred-element': isBlurred }">
        {{ transaction.BTC_summ }}
      </div>
      <span class="hash-id">{{ transaction.hashid }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import SentIcon from '@/assets/icons/transactions/SentIcon.vue'
import ReceivedIcon from '@/assets/icons/transactions/ReceivedIcon.vue'
import InProgress from '@/assets/icons/transactions/InProgress.vue'
import type { APITransaction } from '@/types/transaction'
import router from '@/router'

export default defineComponent({
  name: 'TransactionItem',
  components: { InProgress, ReceivedIcon, SentIcon },
  props: {
    transaction: {
      type: Object as PropType<APITransaction>,
      required: true,
    },
    isBlurred: {
      type: Boolean,
      default: false,
      required: true,
    },
  },

  setup(props) {
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
    const copyHashId = () => {
      navigator.clipboard.writeText(props.transaction.hashid)
    }

    const openTransaction = () => {
      router.push(`/transactions/${props.transaction.id}`)
    }

    return {
      formatDate,
      copyHashId,
      openTransaction,
    }
  },
})
</script>

<style scoped>
.hash-id {
  font-size: 14px;
  color: #04a2fd;
  font-weight: 700;
  text-align: center;
}
.amount-wrapper {
  display: flex;
  flex-direction: column;
}

.transaction {
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 12px;
  background-color: #1e2949;
  border-radius: 8px;
  margin-top: 8px;
}

.transaction-icon {
  width: 48px;
  aspect-ratio: 1;
}

.transaction-info {
  margin-left: 12px;
  flex-grow: 1;
}

.transaction-text {
  font-size: 16px;
  color: white;
}

.transaction-date {
  font-size: 14px;
  color: #b1c1d2;
}

.transaction-amount {
  font-size: 16px;
  color: white;
}
</style>
