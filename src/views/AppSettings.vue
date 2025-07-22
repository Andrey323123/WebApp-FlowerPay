<template>
  <div class="settings-view">
    <!-- <div class="settings-view__money-turnover-wrapper">
      <span>Оборот</span>
      <div class="settings-view__money-turnover">
        <span :class="{ 'blurred-element': blurStore.isBlurred }">0.00</span>
        <span class="settings-view__currency-sign">$</span>
      </div>
    </div> -->
    <div class="settings-view__app-settings-container">
      <div class="settings-view__block-wrapper">
        <div class="settings-view__icon-text-wrapper">
          <HideBalance />
          <span>Скрыть баланс</span>
        </div>
        <IosToggle :model-value="blurStore.isBlurred" @click="blurStore.toggleBlur" />
      </div>

      <div class="settings-view__block-wrapper" @click="router.push('/settings/notifications')">
        <div class="settings-view__icon-text-wrapper">
          <SettingsNotification />
          <span>Уведомления</span>
        </div>
        <span class="settings-view__notification_type">Все</span>
      </div>
    </div>

    <div class="settings-view__user-actions-container" @click="handleViperrClick">
      <div class="settings-view__block-wrapper">
        <div class="settings-view__icon-text-wrapper">
          <SupportIcon />
          <span>Поддержка</span>
        </div>
      </div>
      <div
        class="settings-view__block-wrapper settings-view__block-wrapper--agreement"
        @click="handleAgreementClick"
      >
        <span>Пользовательское соглашение</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SettingsNotification from '@/assets/icons/settings/SettingsNotification.vue'
import HideBalance from '@/assets/icons/settings/HideBalance.vue'
import IosToggle from '@/components/buttons/ToggleButton.vue'
import SupportIcon from '@/assets/icons/settings/SupportIcon.vue'
import { useWebAppBackButton, useWebAppNavigation } from 'vue-tg'
import router from '@/router'
import { useBlurStore } from '@/stores/walletVisibilityStore'
import { useNavbarStore } from '@/stores/navbarStore'
import { onMounted, onUnmounted } from 'vue'

const appNav = useWebAppNavigation()

const blurStore = useBlurStore()
const navbar = useNavbarStore()
const back = useWebAppBackButton()

back.showBackButton()

back.onBackButtonClicked(() => {
  router.back()
  back.hideBackButton()
})

onMounted(() => {
  navbar.setIsOpen(false)
})

onUnmounted(() => {
  back.hideBackButton()
})

const handleAgreementClick = () => {
  appNav.openLink(
    'https://telegra.ph/Privetstvuem-vas-v-nashem-Telegram-prilozhenii-Tochka-Obmena-My-cenim-vash-vybor-i-stremimsya-sdelat-obmen-kriptovalyut-bystrym--12-18',
    {
      try_instant_view: true,
    },
  )
}

const handleViperrClick = () => {
  appNav.openTelegramLink('https://t.me/ObmenTochkaHelpBot')
}
</script>

<style lang="postcss">
.notification-link {
  text-decoration: none;
  color: inherit;
  display: block;
}
.settings-view {
  display: flex;
  flex-direction: column;
  padding: 18px;
  font-family: 'SF Pro Display', sans-serif;
  min-height: 100vh;

  &__money-turnover-wrapper {
    font-size: 18px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  &__money-turnover {
    font-weight: bold;
    color: var(--secondary-text-color);
  }

  &__notification_type,
  &__currency-sign {
    color: var(--currency-color);
  }

  &__block-wrapper {
    cursor: pointer;
    font-weight: normal;
    height: 64px;
    box-sizing: border-box;
    padding: 12px 16px 12px 8px;
    border-radius: 12px;
    display: flex;
    background-color: var(--block-background-color);
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
  }

  &__block-wrapper--agreement {
    font-weight: 400;
    justify-content: start;
    padding-left: 16px;
  }

  &__icon-text-wrapper {
    display: flex;
    gap: 8px;
    font-size: 18px;
    font-weight: normal;
    align-items: center;
    margin-right: auto;
  }

  &__user-actions-container,
  &__app-settings-container {
    margin-top: 24px;
    flex-direction: column;
    gap: 8px;
    display: flex;
  }

  &__user-actions-container {
    padding-bottom: calc(var(--safe-area-inset-bottom) + 21px);
    margin-top: auto;
    width: 100%;
    box-sizing: border-box;
  }
}
</style>
