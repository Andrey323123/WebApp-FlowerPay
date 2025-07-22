<template>
  <div class="deposit-item" @click="toggleSelect">
    <div class="deposit-block">
      <div class="deposit-block-meta">
        <img :src="bank.icon" alt="" class="bank-icon" />
        <span class="wallet-text">{{ bank.name }}</span>
      </div>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="11" stroke="#04A2FD" stroke-width="2" />
        <circle v-if="isSelected" cx="12" cy="12" r="8" fill="#04A2FD" class="check-animation" />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
interface DepositItemProps {
  icon: string
  name: string
  api_name: string
}

const props = defineProps<{
  bank: DepositItemProps
  isSelected?: boolean
}>()

const emit = defineEmits(['select'])

const toggleSelect = () => {
  emit('select', props.bank.api_name)
}
</script>

<style lang="postcss" scoped>
.bank-icon {
  width: 48px;
  aspect-ratio: 1 / 1;
}

.deposit-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.deposit-block {
  user-select: none;
  background: #1e2949;
  border-radius: 16px;
  padding: 12px 8px;

  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #2a3761;
  }
}

.wallet-text {
  color: #ffffff;
  font-weight: 400;
  font-size: 18px;
}

.arrow-icon {
  color: #b1c1d2;
}

.deposit-block-meta {
  display: flex;
  gap: 10px;
  align-items: center;
}

.input-container {
  padding: 12px 8px;
  background: #1e2949;
  margin-top: 8px;
  border-radius: 16px;
}

.amount-input {
  width: 100%;
  background: transparent;
  border: none;
  color: white;
  font-size: 16px;
  outline: none;

  &::placeholder {
    color: #b1c1d2;
  }
}

.check-animation {
  animation: check-pulse 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
}

@keyframes check-pulse {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease-out;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
