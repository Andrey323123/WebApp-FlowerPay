<template>
  <div class="withdraw">
    <router-link to="/withdraw-coins" class="wallet-link">
      <div class="wallet-block">
        <span class="wallet-text">Внешний кошелек</span>
        <svg
          width="12"
          height="20"
          viewBox="0 0 12 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 1L10.1741 9.25671C10.6155 9.65395 10.6155 10.3461 10.1741 10.7433L1 19"
            stroke="#04A2FD"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </svg>
      </div>
    </router-link>
  </div>
</template>

<script lang="ts" setup>
import { useNavbarControl } from '@/composables/useNavbarControl'
import router from '@/router'
import { useWebAppBackButton } from 'vue-tg'

const btn = useWebAppBackButton()

if (!btn.isBackButtonVisible) {
  btn.showBackButton()
}

btn.showBackButton()
btn.onBackButtonClicked(() => {
  router.back()
  btn.hideBackButton()
})
useNavbarControl()
</script>

<style lang="postcss" scoped>
.withdraw {
  padding: 18px;
}

.crypto-header {
  display: flex;
  align-items: center;
  padding: 15px;
  cursor: pointer;
  gap: 10px;
}

.crypto-icon {
  width: 24px;
  height: 24px;
}

.crypto-details {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.input-group {
  margin-bottom: 15px;

  label {
    display: block;
    margin-bottom: 5px;
    color: #b1c1d2;
  }
}

.input {
  width: 100%;
  padding: 12px;
  background: #141b36;
  border: 1px solid #2d3867;
  border-radius: 8px;
  color: white;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
}

.submit-button {
  width: 100%;
  padding: 12px;
  background: #3b82f6;
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background: #2563eb;
  }
}

.wallet-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.wallet-block {
  background: #1e2949;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
</style>
