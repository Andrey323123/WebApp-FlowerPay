<template>
  <div class="deposit-form" @click="handleWrapperClick">
    <div class="form-fields">
      <div class="input-group">
        <input
          ref="nameInput"
          type="text"
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
          placeholder="Email"
          class="input-field"
          :class="{ 'input-error': isEmailError }"
        />
      </div>
      <div class="field-block">
        <div class="field-value">
          {{ params.card_number }} | {{ banks.find((it) => it.bank == params.bank)?.name }}
        </div>
      </div>

      <div class="field-block">
        <div class="field-value">{{ params.amount + ' ' + params.crypto_name }}</div>
      </div>

      <label class="amount-label">Сумма к зачислению</label>
      <div class="field-block">
        <div class="field-container">
          <div class="field-value">{{ formattedAmount }} ₽</div>
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
        <span>Нажимая ПОДТВЕРДИТЬ, вы подтвержаете правильность введенных данных.</span>
      </div>
    </div>
    <button class="submit-button" @click="handleSubmit">Подтвердить</button>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, computed, onUnmounted, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import { useWebAppBackButton, useWebAppHapticFeedback } from 'vue-tg'
import router from '@/router'
import type { User } from '@/types/user'
import { useNavbarStore } from '@/stores/navbarStore'

const isTransactionLoading = ref(false)

interface WithdrawParams {
  amount: string
  bank: 'sberbank' | 'tbank'
  crypto_name: string
  will_receive: string
  card_number: string
}

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

const axios = inject('axios')
const user = inject<User>('user')

const ww_router = useRoute()

const params = ww_router.query as unknown as WithdrawParams

const navbar = useNavbarStore()

const managerId = ref('')

const banks = ref([
  {
    name: 'СБЕР',
    bank: 'sberbank',
  },
  {
    name: 'Т-Банк',
    bank: 'tbank',
  },
  {
    name: 'Альфа-Банк',
    bank: 'alfabank',
  },
  {
    name: 'Газпромбанк',
    bank: 'gazprom',
  },
])
const formattedAmount = computed(() => {
  if (!params.will_receive) return '0.00'

  const normalizedAmount = params.will_receive.replace(',', '.')

  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true, // Включаем разделение разрядов
  }).format(Number(normalizedAmount))
})

const getDepositInfo = async () => {
  try {
    const response = await axios.get('/rub/deposit/carddata/', {
      params: { bank_api_name: ww_router.query.bank, summ: ww_router.query.amount },
    })
    managerId.value = response.data.manager_id
  } catch (error) {
    console.error(error)
  }
}

const postTransaction = async () => {
  try {
    const response = await axios.post('/rub/withdraw/createtransaction/', {
      user_id: user!.data.user_id,
      manager_id: managerId.value,
      card_number: params.card_number,
      BTC_summ: +params.amount,
      email: email.value,
      sender_name: fullName.value,
      summ: +params.will_receive,
    })
    console.log(response)
  } catch (error) {
    console.error(error)
  }
}

const { notificationOccurred } = useWebAppHapticFeedback()

const btn = useWebAppBackButton()

btn.onBackButtonClicked(() => {
  navbar.setIsOpen(false)
  router.back()
})

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
  router.push('/')
  notificationOccurred('success')
}

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
  margin-bottom: 20px;
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
  width: 100%;
  padding-right: 40px; /* Чтобы текст не залезал под иконку */
  transition: color 0.3s ease;
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

  -webkit-tap-highlight-color: transparent;
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
