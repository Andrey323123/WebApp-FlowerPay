<template>
  <div class="deposit-form" @click="handleWrapperClick">
    <div class="form-fields">
      <label class="amount-label">Кошелек</label>
      <WalletSelector @walletChange="handleWalletChange" />

      <transition name="slide-fade">
        <div class="input-group" v-if="walletType === 'external'">
          <input
            ref="walletAddressInput"
            type="text"
            v-model="walletAddress"
            placeholder="Адрес кошелька"
            class="input-field"
            :class="{ 'input-error': isWalletAddressError }"
          />
        </div>
      </transition>

      <div class="input-group">
        <input
          ref="nameInput"
          type="text"
          autocomplete="name"
          v-model="fullName"
          placeholder="ФИО"
          class="input-field"
          :class="{ 'input-error': isNameError }"
        />
      </div>

      <div class="input-group">
        <input
          ref="emailInput"
          type="text"
          v-model="email"
          autocomplete="email"
          placeholder="Email"
          class="input-field"
          :class="{ 'input-error': isEmailError }"
        />
      </div>
      <div class="field-block">
        <div class="field-value">{{ formattedCardNumber }}</div>
        <div class="copy-icon" @click="copyCardNumber">
          <CopyIcon />
        </div>
      </div>

      <div class="field-block">
        <div class="field-value">{{ depositData?.card_name || 'ФИО' }}</div>
      </div>

      <label class="amount-label">При переводе используйте точную сумму</label>
      <div class="field-block">
        <div class="field-container">
          <div class="field-value">{{ formattedAmount || 'Сумма' }}</div>
          <div class="copy-icon" @click="copyAmount">
            <CopyIcon />
          </div>
        </div>
      </div>
      <div class="confirm-info">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="8" cy="8" r="7.5" stroke="#04A2FD" />
          <path
            d="M7.46396 3.62976H8.66588L8.56372 9.42303H7.56612L7.46396 3.62976ZM8.66588 12.1814C8.51364 12.3377 8.31532 12.4158 8.07093 12.4158C7.82654 12.4158 7.62622 12.3377 7.46997 12.1814C7.31372 12.0252 7.2356 11.8249 7.2356 11.5805C7.2356 11.3361 7.31372 11.1358 7.46997 10.9795C7.62622 10.8193 7.82654 10.7391 8.07093 10.7391C8.31532 10.7391 8.51364 10.8173 8.66588 10.9735C8.82213 11.1298 8.90026 11.3321 8.90026 11.5805C8.90026 11.8249 8.82213 12.0252 8.66588 12.1814Z"
            fill="white"
          />
        </svg>
        <span>После отправки средств нажмите ПОДТВЕРДИТЬ ниже.</span>
      </div>
    </div>
    <button class="submit-button" @click="handleSubmit">Подтвердить</button>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, computed, onUnmounted, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import WalletSelector from '@/components/WalletSelector.vue'
import CopyIcon from '@/assets/icons/CopyIcon.vue'

import { useWebAppBackButton, useWebAppHapticFeedback } from 'vue-tg'
import router from '@/router'
import type { User } from '@/types/user'
import { useNavbarStore } from '@/stores/navbarStore'

const fullName = ref('')
const email = ref('')

const isNameError = ref(false)
const isEmailError = ref(false)

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
  return emailRegex.test(email)
}

const validateName = (name: string): boolean => {
  // Проверяем что:
  // 1. Имя содержит только буквы и пробелы
  // 2. Минимум 2 слова (Имя и Фамилия)
  // 3. Каждое слово начинается с большой буквы
  // 4. Минимальная длина каждого слова 2 символа
  return name.length > 0
}

interface DepositInfo {
  manager_id: string
  card_number: string
  card_name: string
  summ: string
}

const walletType = ref<'internal' | 'external'>('internal')
const walletAddress = ref('')
const walletAddressInput = ref<HTMLInputElement | null>(null)
const isWalletAddressError = ref(false)

const handleWalletChange = (type: 'internal' | 'external') => {
  walletType.value = type
  impactOccurred('light')
}

const axios = inject('axios')
const user = inject<User>('user')

const ww_router = useRoute()

console.log(ww_router.params)
const depositData = ref<DepositInfo | null>(null)

const postTransaction = async () => {
  try {
    const response = await axios.post('/rub/deposit/createtransaction/', {
      user_id: user.data.user_id,
      bank_api_name: ww_router.params.bank,
      manager_id: depositData.value?.manager_id,
      card_number: depositData.value?.card_number,
      card_name: depositData.value?.card_name,
      receiver_adress: walletAddress.value || 'local',
      summ: depositData.value?.summ,
      email: email.value,
      sender_name: fullName.value,
      btc_summ: ww_router.query.crypto_amount,
    })
    console.log(response)
  } catch (error) {
    console.error(error)
  }
}

const getDepositInfo = async () => {
  try {
    const response = await axios.get('/rub/deposit/carddata/', {
      params: { bank_api_name: ww_router.params.bank, summ: ww_router.query.amount },
    })
    depositData.value = response.data
  } catch (error) {
    console.error(error)
  }
}

const navbar = useNavbarStore()

const isNavbarOpen = computed(() => navbar.isOpen)

const formattedCardNumber = computed(() => {
  if (!depositData.value?.card_number) return 'Номер карты'
  return (
    depositData.value.card_number
      .replace(/\s/g, '')
      .match(/.{1,4}/g)
      ?.join(' ') || 'Номер карты'
  )
})

const formattedAmount = computed(() => {
  if (!depositData.value?.summ) return '0.00'

  const normalizedAmount = depositData.value.summ.replace(',', '.')

  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true, // Включаем разделение разрядов
  }).format(Number(normalizedAmount))
})

const { notificationOccurred, impactOccurred } = useWebAppHapticFeedback()

const copyCardNumber = () => {
  navigator.clipboard.writeText(depositData.value?.card_number)
  notificationOccurred('success')
}

const copyAmount = () => {
  navigator.clipboard.writeText(depositData.value?.summ)
  notificationOccurred('success')
}

const btn = useWebAppBackButton()

const handleSubmit = async () => {
  if (!validateName(fullName.value)) {
    isNameError.value = true

    setTimeout(() => {
      isNameError.value = false
    }, 300)
    return
  }

  if (!validateEmail(email.value)) {
    isEmailError.value = true

    setTimeout(() => {
      isEmailError.value = false
    }, 300)
    return
  }

  await postTransaction()
  router.push('/deposit/receipt')
}

const nameInput = ref<HTMLInputElement | null>(null)
const emailInput = ref<HTMLInputElement | null>(null)

const handleWrapperClick = (event: MouseEvent) => {
  window.scrollTo(0, 0)
  const target = event.target as HTMLElement

  if (!target.classList.contains('input-field') && !target.closest('.input-group')) {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }

    emailInput.value?.blur()
    nameInput.value?.blur()
  }
}

btn.onBackButtonClicked(() => {
  navbar.setIsOpen(false)
  router.back()
})

onMounted(async () => {
  await getDepositInfo()
  btn.showBackButton()
  navbar.setIsOpen(false)
})
onUnmounted(() => {
  btn.hideBackButton()
})
</script>

<style lang="postcss" scoped>
.input-error {
  color: var(--price-negative-change) !important;
}
.amount-label {
  font-family: 'SF Pro Display', sans-serif;
  display: block;
  font-size: 12px;
  color: #bcbcbc;
  margin-bottom: 10px;
}

.deposit-form {
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

.input-group {
  position: relative;
  width: 100%;
}

.input-wrapper {
  position: relative;
  width: 100%;
}

.input-container {
  position: relative;
  width: 100%;
}

.copy-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  padding: 8px;
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
  transition: color 0.3s ease;
  width: 100%;
  padding-right: 40px;

  &:focus {
    outline: none;
    border-color: #04a2fd;
  }

  &::placeholder {
    color: #b1c1d2;
  }

  &.error {
    color: #ff4444;
  }
}

/* Добавляем стили для невалидного состояния */
.input-group {
  position: relative;

  &.error input {
    border-color: #ff4444;
  }

  margin-bottom: 20px;
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
  margin-top: 20px;
  margin-bottom: var(--safe-area-inset-bottom, 25px);

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

.input-block {
  height: 64px;
  background: #1e2949;
  border-radius: 12px;
  padding: 12px 16px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: #2a3860;
  }

  &__label {
    font-size: 12px;
    color: #b1c1d2;
    margin-bottom: 4px;
  }

  &__value {
    font-size: 16px;
    color: white;
    font-family: 'SF Pro Display', sans-serif;
  }

  &.error {
    border: 1px solid #ff4444;
  }
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.field-block {
  background: #1e2949;
  border-radius: 12px;
  padding: 18px;
  margin-bottom: 12px;
  position: relative;
}

.field-value {
  color: white;
  font-size: 16px;
  font-family: 'SF Pro Display', sans-serif;
  padding-right: 40px;
}

.amount-label {
  color: #b1c1d2;
  font-size: 12px;
  margin-bottom: 8px;
  display: block;
}

.confirm-info {
  margin-top: 30px;

  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 12px;
  color: #b1c1d2;
  margin-top: 20px;
  max-width: 250px;
}
</style>
