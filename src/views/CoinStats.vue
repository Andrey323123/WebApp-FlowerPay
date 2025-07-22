<script setup lang="ts">
import { ref, watch, onMounted, computed, inject, onBeforeMount } from 'vue'

import NotificationIcon from '@/assets/NotificationIcon.vue'

import { SwipeModal } from '@takuma-ru/vue-swipe-modal'
import { useWebAppViewport, useWebAppHapticFeedback } from 'vue-tg'
import { useCryptoStore } from '@/stores/useCryptoStore'
import TimeSelector from '@/components/TimeSelector.vue'
import LineChart from '@/components/LineChart.vue'
import type { TimeFrameKey } from '@/stores/useCryptoStore'

const axios = inject('axios')
const user = inject('user')

const isModalOpen = ref(false)
const priceInput = ref('')
const isInputError = ref(false)

const cryptoStore = useCryptoStore()

// Эта переменная будет хранить цену выбранной точки
const displayedPrice = ref(cryptoStore.currentPrice || 0)

const selectedTime = ref('5m')

const viewport = useWebAppViewport()
const { impactOccurred, notificationOccurred } = useWebAppHapticFeedback()
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

const handleNotificationClick = () => {
  isModalOpen.value = true
  viewport.disableVerticalSwipes()
}

const handleButtonClick = async () => {
  if (isNumber(priceInput.value)) {
    await postPrice()
    notificationOccurred('success')
    priceInput.value = ''
    isModalOpen.value = false
    viewport.enableVerticalSwipes()
  } else {
    notificationOccurred('error')
    isInputError.value = true
    setTimeout(() => {
      isInputError.value = false
    }, 300)
  }
}

const formatCoinPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
}

const formatPrice = (event) => {
  let value = event.target.value.replace(/,/g, '.') // Заменяем запятые на точки
  value = value.replace(/[^\d.]/g, '') // Оставляем только цифры и точку

  // Проверяем, чтобы была только одна точка
  const dots = value.match(/\./g)
  if (dots && dots.length > 1) {
    value = value.substring(0, value.lastIndexOf('.'))
  }

  priceInput.value = value
}

const postPrice = async () => {
  try {
    const response = await axios.post('notification/create/', {
      user_id: user.data.user_id,
      summ: +priceInput.value,
    })
  } catch (error) {
    console.error('Error occurred:', error)
  }
}

const handleTimeChange = async (newTime: string) => {
  console.log('newTime', newTime)
  selectedTime.value = newTime
  await cryptoStore.setTimeFrame(newTime as TimeFrameKey)
}

// Обработчик, который вызывается из LineChart по наведению
const handlePriceHovered = (price: number) => {
  displayedPrice.value = price
}

// Сбрасываем показанную цену на актуальную, когда курсор уходит с графика
const handlePriceHoverEnd = () => {
  displayedPrice.value = cryptoStore.currentPrice || 0
}

onBeforeMount(async () => {
  await cryptoStore.fetchCandleData()
  await cryptoStore.fetchCurrentPrice()
})
</script>

<template>
  <div class="crypto-view">
    <div class="crypto-view__header">
      <div class="crypto-view__header__coin-info">
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M47.2819 29.8057C44.0762 42.663 31.0524 50.4877 18.1921 47.2815C5.33727 44.0761 -2.4883 31.053 0.718846 18.1967C3.92317 5.33806 16.947 -2.48721 29.8032 0.718162C42.6625 3.92354 50.4876 16.9481 47.2816 29.806L47.2818 29.8057H47.2819Z"
            fill="#F7931A"
          />
          <path
            d="M34.7396 20.5807C35.2186 17.3868 32.7804 15.67 29.4465 14.5247L30.5281 10.1983L27.8874 9.54205L26.8346 13.7545C26.1403 13.5818 25.4274 13.4191 24.7189 13.2578L25.7794 9.01756L23.1403 8.36133L22.0582 12.6863C21.4837 12.5559 20.9195 12.4269 20.3721 12.2911L20.3751 12.2775L16.7336 11.3706L16.0312 14.1834C16.0312 14.1834 17.9903 14.6313 17.949 14.6589C19.0183 14.925 19.2117 15.631 19.1796 16.1906L17.9476 21.1194C18.0212 21.138 18.1167 21.165 18.2221 21.2072C18.134 21.1854 18.0403 21.1616 17.943 21.1384L16.2162 28.0429C16.0855 28.3669 15.7538 28.8531 15.0062 28.6685C15.0326 28.7067 13.0869 28.1908 13.0869 28.1908L11.7759 31.2054L15.2123 32.0598C15.8515 32.2197 16.478 32.387 17.0949 32.5443L16.0022 36.9203L18.6398 37.5765L19.722 33.247C20.4425 33.442 21.1418 33.622 21.8264 33.7916L20.7479 38.1008L23.3887 38.757L24.4813 34.3892C28.9841 35.2391 32.3699 34.8965 33.7951 30.8345C34.9434 27.5641 33.7379 25.6778 31.369 24.4477C33.0944 24.0508 34.394 22.919 34.7405 20.581L34.7397 20.5804L34.7396 20.5807ZM28.7063 29.0183C27.8902 32.2887 22.3692 30.5208 20.5792 30.0775L22.0293 24.28C23.8192 24.7257 29.5592 25.6076 28.7064 29.0183H28.7063ZM29.523 20.5333C28.7785 23.508 24.1833 21.9967 22.6927 21.6261L24.0074 16.3682C25.498 16.7388 30.2985 17.4304 29.5232 20.5333H29.523Z"
            fill="white"
          />
        </svg>

        <span class="crypto-view__header__text"
          >BTC
          <span class="secondary">· Курс Биткоина</span>
        </span>
      </div>
      <NotificationIcon
        @click="handleNotificationClick"
        class="crypto-view__notification-icon-wrapper"
      />
    </div>
    <div class="crypto-view__price-block">
      <!-- Используем displayedPrice, которая обновляется из LineChart -->
      <Skeleton
        v-if="cryptoStore.isPriceLoading"
        shape="rectangle"
        border-radius="12px"
        width="30%"
        height="20px"
      />
      <span v-else>${{ formatCoinPrice(displayedPrice) }}</span>
      <Skeleton
        v-if="cryptoStore.isPriceLoading"
        shape="rectangle"
        border-radius="12px"
        width="15%"
        height="20px"
      />
      <span
        v-else
        :class="{
          'price-positive': cryptoStore.priceChange24h > 0,
          'price-negative': cryptoStore.priceChange24h < 0,
        }"
      >
        ${{ formatCoinPrice(Math.abs(cryptoStore.priceChange24h || 0)) }} ({{
          cryptoStore.priceChange24h > 0 ? '+' : ''
        }}{{ (cryptoStore.priceChangePercent24h || 0).toFixed(2) }}%)
      </span>
    </div>
    <Skeleton
      v-if="cryptoStore.chartLoading || cryptoStore.currentData.length === 0"
      shape="rectangle"
      border-radius="12px"
      width="100%"
      height="370px"
    />
    <LineChart
      v-else
      :selected-time="selectedTime"
      @priceHovered="handlePriceHovered"
      @priceHoverEnd="handlePriceHoverEnd"
    />
    <TimeSelector @time-changed="handleTimeChange" />
  </div>
  <SwipeModal v-model="isModalOpen" snap-point="80vh" is-scrolllock="true">
    <div class="crypto-view__bottom-modal-wrapper">
      <div class="crypto-view__bottom-modal-wrapper__user-information">
        <h1>Уведомления о достижении цены</h1>
        <span>Укажите цену, при достижении которой мы отправим вам пуш-уведомление</span>
      </div>
      <div class="crypto-view__bottom-modal-wrapper__price-input-box">
        <input
          type="text"
          inputmode="decimal"
          placeholder="$0.00"
          class="exchange__input"
          v-model="priceInput"
          @input="formatPrice"
          :class="{ 'input-error': isInputError }"
        />
      </div>
      <button class="crypto-view__bottom-modal-wrapper__button" @click="handleButtonClick">
        Добавить
      </button>
    </div>
  </SwipeModal>
</template>

<style lang="postcss" scoped>
.input-error {
  color: var(--price-negative-change) !important;
}

.arrow-selector {
  background-color: var(--icon-backgroud-color);
  border-radius: 4px;
}

.crypto-view {
  display: flex;
  flex-direction: column;
  padding: 16px;
  color: white;
  font-family: 'SF Pro Display', sans-serif;

  &__price-block {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 24px;
    margin-bottom: 12px;
    line-height: 20px;

    font-weight: 600;
    font-size: 32px;

    span:last-child {
      font-size: 12px;

      color: #2ce99a;
    }

    .price-positive {
      color: #2ce99a;
    }

    .price-negative {
      color: #ff5449;
    }
  }

  &__header {
    display: flex;
    background-color: #1e2949;
    justify-content: space-between;

    padding: 8px;
    border-radius: 12px;

    &__coin-info {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    &__text {
      font-size: 16px;
      line-height: 20px;
      color: white;
      font-weight: 600;

      .secondary {
        color: #b1c1d2;
      }
    }
  }

  &__crypto-main-info {
    display: flex;
    align-items: center;
  }

  &__crypto-info {
    margin-left: 6px;
    display: flex;
    flex-direction: column;
  }

  &__crypto-name {
    gap: 4px;
    display: flex;
    align-items: center;
    font-weight: 600;
  }

  &__crypto-name-details {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #b1c1d2;
  }

  &__crypto-price-wrapper {
    display: flex;
    align-items: baseline;
    font-weight: 700;
    gap: 6px;
  }

  &__current-price {
    font-size: 20px;
  }

  &__price-change {
    font-size: 12px;
    font-weight: 600;

    &.positive-change {
      color: var(--price-positive-change);
    }

    &.negative-change {
      color: var(--price-negative-change);
    }
  }

  &__notification-icon-wrapper {
    background-color: #171b36;
    cursor: pointer;
    padding: 12px;
    box-sizing: content-box;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__min-coin-price,
  &__max-coin-price {
    margin-left: auto;
    box-sizing: border-box;
    padding: 12px 0 12px 0;
    line-height: 16px;
    color: var(--secondary-text-color);
    font-family: 'SF Pro Display', sans-serif;
    font-weight: normal;
    font-size: 12px;
  }

  &__min-coin-price {
    margin-left: 0;
  }

  &__crypto-icon {
    width: 53px;
    aspect-ratio: 1;
  }

  &__chart-container {
    height: 370px;
    min-height: 370px;
    box-sizing: border-box;
  }

  &__time-selector button.active {
    background-color: #3f51b5;
    color: white;
  }
  &__bottom-modal-wrapper {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    padding: 18px 8px;
    font-family: 'SF Pro Display', sans-serif;

    &__user-information {
      display: flex;
      flex-direction: column;

      h1 {
        font-size: 18px;
        color: white;
        line-height: 24px;
        margin-bottom: 8px;
      }

      span {
        font-size: 14px;
        line-height: 18px;
        color: var(--secondary-text-color);
      }
    }

    &__price-input-box {
      display: flex;
      padding: 0 8px;
      height: 64px;
      border-radius: 12px;
      justify-content: space-between;
      background-color: var(--block-background-color);
      margin-top: 12px;

      input {
        flex: 1;
        font-weight: 900;
        background: transparent;
        transition: color 0.3s ease;
        border: none;
        outline: none;
        color: white;
        font-size: 20px;
        font-weight: bold;
        text-align: left;
        padding-right: 8px;
        min-width: 0;
        width: 100%;
        font-size: 20px;
        &::-webkit-inner-spin-button,
        &::-webkit-outer-spin-button {
          -webkit-appearance: none;
        }
        -moz-appearance: textfield;
      }
    }

    &__button {
      width: 100%;
      padding: 18px;
      background-color: var(--button-background-color);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      margin-top: 24px;
    }
  }

  .price-skeleton {
    width: 80px;
    height: 24px;
    border-radius: 4px;
  }

  .chart-skeleton {
    width: 100%;
    height: 370px;
    border-radius: 12px;
  }
}
:deep(.swipe-modal-content) {
  background-color: var(--base-background-color);
}

:deep(.p-skeleton) {
  background-color: var(--background-secondary);

  &::after {
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);
  }
}
</style>
