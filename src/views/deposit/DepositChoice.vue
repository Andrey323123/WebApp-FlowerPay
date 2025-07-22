<template>
  <div class="deposit-choice" ref="containerRef">
    <div class="deposit-choice__list">
      <DepositItem
        v-for="bank in banks"
        :key="bank.name"
        :bank="bank"
        :is-selected="selectedBank === bank.api_name"
        @select="handleCoinSelect"
      />
    </div>
    <transition name="slide-fade">
      <div class="input-wrapper" v-show="selectedBank">
        <label class="amount-label">Комиссия сервиса: 4%</label>
        <div class="input-container">
          <input
            type="text"
            inputmode="decimal"
            :value="amount"
            @input="(e) => formatCryptoAmount(e.target.value)"
            placeholder="Сумма"
            class="input-field"
          />
        </div>
      </div>
    </transition>
    <transition name="slide-fade">
      <button class="submit-button" v-show="isValidAmount" @click="handleClick">Подтвердить</button>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DepositItem from '@/components/DepositItem.vue'
import { useNavbarControl } from '@/composables/useNavbarControl'

const router = useRouter()
const selectedBank = ref('')
const amount = ref('')

import {
  useWebAppHapticFeedback,
  useWebAppViewport,
  useWebAppMainButton,
  useWebAppBackButton,
} from 'vue-tg'
import { useTelegramViewportHack } from '@/composables/useTelegramViewportHack'

const banks = ref([
  {
    name: 'СБЕР',
    icon: new URL('../../assets/icons/banks/sber.png', import.meta.url).href,
    api_name: 'sberbank',
  },
  {
    name: 'Т-Банк',
    icon: new URL('../../assets/icons/banks/tbank.png', import.meta.url).href,
    api_name: 'tbank',
  },
])

const handleCoinSelect = (coinType: string) => {
  selectedBank.value = coinType
}

// Добавляем вычисляемое свойство для проверки суммы

const containerRef = ref<HTMLElement | null>(null)

const formatCryptoAmount = (value: string) => {
  if (!value) {
    amount.value = ''
    return
  }

  // Заменяем все запятые на точки
  let formatted = value.replace(/,/g, '.')

  // Удаляем все символы, кроме цифр и точки
  formatted = formatted.replace(/[^\d.]/g, '')

  // Удаляем лишние точки, оставляя только первую
  const parts = formatted.split('.')
  formatted = parts[0] + (parts.length > 1 ? '.' + parts.slice(1).join('') : '')

  // Убираем случаи, когда поле начинается с точки
  if (formatted.startsWith('.')) {
    formatted = '0' + formatted
  }

  // Убираем ведущие нули перед числом, оставляя один 0, если после него идёт точка
  if (formatted.startsWith('0') && formatted.length > 1 && formatted[1] !== '.') {
    formatted = formatted.replace(/^0+/, '')
  }

  // Обновляем значение в ref
  amount.value = formatted

  // Обновляем значение поля ввода, если нужно
  const inputElement = document.querySelector('.input-field') as HTMLInputElement
  if (inputElement) {
    inputElement.value = formatted
  }
}

const isNumber = (value) => {
  if (
    typeof value === 'string' &&
    /^(0|[1-9]\d*)(\.\d{1,8})?$/.test(value) &&
    parseFloat(value) > 0
  ) {
    return true
  }

  if (
    typeof value === 'number' &&
    /^(0|[1-9]\d*)(\.\d{1,8})?$/.test(value.toFixed(8).replace(/\.?0+$/, '')) &&
    value > 0
  ) {
    return true
  }

  return false
}

const isValidAmount = computed(() => {
  const numAmount = parseFloat(amount.value)
  return isNumber(amount.value) && numAmount > 0
})

const handleClick = () => {
  router.push('/deposit-form/' + selectedBank.value)
}

useNavbarControl()

const btn = useWebAppBackButton()

if (!btn.isBackButtonVisible) {
  btn.showBackButton()
}

btn.onBackButtonClicked(() => router.back())
</script>

<style lang="postcss" scoped>
.deposit-choice {
  padding: 18px;
  height: 100vh;
  &__list {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 20px;
  }
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
  width: 100%;
  padding-right: 40px; /* Чтобы текст не залезал под иконку */

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
  width: 100%;
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

.amount-label {
  font-family: 'SF Pro Display', sans-serif;
  display: block;
  font-size: 12px;
  color: #bcbcbc;
  margin-bottom: 10px;
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
