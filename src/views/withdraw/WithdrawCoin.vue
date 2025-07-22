<template>
  <div class="withdraw-coin">
    <div class="withdraw-content-wrapper">
      <div class="selected-coin">
        <CoinToWithdraw :coin="selectedCoin" />
      </div>

      <div class="withdraw-form">
        <div class="input-group">
          <input
            type="text"
            v-model="walletAddress"
            :placeholder="'Адрес ' + selectedCoin.short_name"
            class="input-field"
          />
        </div>

        <div class="amount-input">
          <input
            type="number"
            v-model="amount"
            :placeholder="selectedCoin.short_name"
            class="input-field"
          />
        </div>
      </div>
    </div>
    <transition name="slide-fade">
      <button v-if="isFormValid" class="submit-button" @click="sendBTC">Вывести</button>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import CoinToWithdraw from '@/components/CoinToWithdraw.vue'
import { useNavbarControl } from '@/composables/useNavbarControl'
import btc_log from '@/assets/icons/btc_log.png'
import { useWebAppBackButton } from 'vue-tg'
import router from '@/router'
import type { User } from '@/types/user'

const route = useRoute()
const walletAddress = ref('')
const amount = ref('')

const btcBalance = ref(0)
const btcPrice = ref(0.0)

const axios = inject('axios')

const user = inject<User>('user')

onBeforeMount(async () => {
  await getBTC()
  await getBTCCost()
})
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

const sendBTC = async () => {
  try {
    const response = await axios.post('/btc/transfer/', {
      user_id: user.data.user_id,
      btc_amount: amount.value,
      transfer_address: walletAddress.value,
    })
    console.log('ТРАНЗАКЦИЯ УСПЕШНО ОТПРАВЛЕННА')
  } catch (error) {
    console.error('Error occurred:', 'В error ХРАНИТСЯ РЕАЛЬНАЯ ОШИБКА')
  }
}

const drochuHui = computed(() => {
  return btcBalance.value * btcPrice.value
})

const selectedCoin = ref({
  name: 'Bitcoin',
  icon: btc_log,
  available: btcBalance,
  p_converted: drochuHui,
  short_name: 'BTC',
})

const btn = useWebAppBackButton()

if (!btn.isBackButtonVisible) {
  btn.showBackButton()
}

const isFormValid = computed(() => {
  return walletAddress.value.trim() !== '' && amount.value !== ''
})

btn.showBackButton()
btn.onBackButtonClicked(() => {
  router.back()
})

useNavbarControl()
</script>

<style lang="postcss" scoped>
.withdraw-coin {
  height: 100vh;

  padding: 18px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: var(--safe-area-inset-bottom, 25px);
}

.selected-coin {
  margin-bottom: 20px;
}

.withdraw-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-field {
  height: 64px;
  background: #1e2949;
  border: none;
  font-family: 'SF Pro Display', sans-serif;
  font-weight: 400;
  border-radius: 12px;
  padding: 18px 8px;
  color: white;
  font-size: 16px;
  width: 100%;

  &:focus {
    outline: none;
    border-color: #04a2fd;
  }

  &::placeholder {
    color: #b1c1d2;
  }
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

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
