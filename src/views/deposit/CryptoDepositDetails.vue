<template>
  <div class="crypto-deposit-details-view">
    <div class="details-header">
      <h1>Ваш адрес Bitcoin</h1>
      <span>Отправляйте только Bitcoin (BTC) на этот адрес</span>
    </div>
    <div class="details-wrapper">
      <div class="qr-block">
        <qrcode-vue
          :value="walledAdress"
          :size="200"
          level="H"
          render-as="svg"
          :margin="0"
          :foreground="'#B1C1D2'"
          :background="'#1e2949'"
        />
        <span>Отсканируй QR-код для отправки BTC на свой кошелек</span>
      </div>
      <div class="crypto-meta">
        <span>Ваш адрес BTC</span>
        <span>{{ walledAdress }}</span>
        <button class="submit-button" @click="copyWalletAddress">Копировать</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import QrcodeVue from 'qrcode.vue'
import { useNavbarControl } from '@/composables/useNavbarControl'
import { ref, onBeforeMount, inject, onMounted, onUnmounted } from 'vue'
import type { User } from '@/types/user'
import { useWebAppBackButton, useWebAppHapticFeedback } from 'vue-tg'
import router from '@/router'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

const { notificationOccurred } = useWebAppHapticFeedback()

const axios = inject('axios')

const user = inject<User>('user')

const getAddr = async () => {
  try {
    const response = await axios.get('/btc/address/', {
      params: { user_id: user.data.user_id },
    })
    const walledAdress = response.data.address
    console.log(walledAdress)
  } catch (error) {
    console.error('Error occurred:', error)
  }
}

onBeforeMount(() => {
  getAddr()
})

const walledAdress = ref('')

const copyWalletAddress = () => {
  navigator.clipboard.writeText(walledAdress.value)
  notificationOccurred('success')
}

const getAdress = async () => {
  try {
    const response = await axios.get('/btc/address/', {
      params: { user_id: user?.data.user_id },
    })
    walledAdress.value = response.data.address
  } catch (error) {
    console.error(error)
  }
}

onMounted(async () => {
  await getAdress()
})
const btn = useWebAppBackButton()

if (!btn.isBackButtonVisible) {
  btn.showBackButton()
}

btn.onBackButtonClicked(() => router.push('/'))

onUnmounted(() => {
  btn.hideBackButton()
})

useNavbarControl()
</script>

<style lang="postcss" scoped>
.crypto-deposit-details-view {
  padding: 18px;
  display: flex;
  flex-direction: column;
  font-family: 'SF Pro Display', sans-serif;
  align-items: center;
}

.details-header {
  text-align: center;

  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 35px;
  h1 {
    margin: 0;
    font-size: 24px;
    font-weight: bold;
    color: white;
    font-family: 'SF Pro Display', sans-serif;
  }

  span {
    margin: 0;
    font-size: 16px;
    font-weight: 400px;
    color: #b1c1d2;
  }
}

.crypto-meta {
  text-align: center;
  background-color: #1e2949;
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-radius: 12px;
  span {
    word-break: break-all; /* Для переноса длинного текста */
    font-size: 14px;

    &:first-child {
      color: #b1c1d2;
      font-weight: 400;
      font-size: 14px;
    }

    &:nth-child(2) {
      font-family: 'SF Pro Display', sans-serif;
      font-weight: 500;
      font-size: 16px;
      color: white;
    }
  }
}

.qr-block {
  text-align: center;
  color: #b1c1d2;
  gap: 20px;
  align-items: center;
  background-color: #1e2949;
  padding: 35px;

  font-size: 14px;
  font-weight: 400;
  justify-content: center;
  flex-direction: column;
  display: flex;
  border-radius: 12px;
  box-sizing: border-box;
}

.submit-button {
  background: #04a2fd;
  border-radius: 12px;
  padding: 14px;
  color: white;
  border: none;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  font-family: 'SF Pro Display', sans-serif;
  margin-top: 10px;
  &:hover {
    background: #0389d6;
  }
  transition: background 0.2s ease;
}

.details-wrapper {
  display: flex;
  flex-direction: column;
  border: 12px;
  gap: 20px;
  max-width: 250px;
}
</style>
