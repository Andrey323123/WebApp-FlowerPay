<!-- src/views/Exchange.vue -->
<template>
  <div class="exchange-container">
    <h2>Обмен</h2>
    <div class="form-group">
      <label for="card">Номер карты:</label>
      <input v-model="card" type="text" id="card" />
    </div>
    <div class="form-group">
      <label for="summ">Сумма:</label>
      <input v-model="summ" type="text" id="summ" />
    </div>
    <div class="form-group">
      <label for="transactionId">Transaction ID:</label>
      <input v-model="transactionId" type="text" id="transactionId" />
    </div>
    <button @click="sendMessage">Отправить</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { inject } from 'vue'

const route = useRoute()
const user = inject('user') as { sendPaymentMessage: (card: string, summ: string, transactionId: string) => Promise<void> }

const card = ref('4990 5678 9012 3456')
const summ = ref('1000 RUB')
const transactionId = ref('txn_123456')

const sendMessage = async () => {
  if (user && route.path === '/exchange') {
    await user.sendPaymentMessage(card.value, summ.value, transactionId.value)
  }
}
</script>

<style scoped>
.exchange-container {
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>