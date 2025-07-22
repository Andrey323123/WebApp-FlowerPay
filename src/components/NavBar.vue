<!-- Navbar.vue -->
<template>
  <div class="navbar">
    <div
      v-for="(item, index) in navItems"
      :key="index"
      :class="[
        'navbar__nav-button',
        { 'navbar__nav-button--expanded': selectedButton === item.route },
      ]"
      @click="navigate(item.route)"
    >
      <component :is="item.icon" class="navbar__nav-button-icon" />
      <span v-if="selectedButton === item.route" class="navbar__nav-button-text">{{
        item.text
      }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useWebAppHapticFeedback } from 'vue-tg'
import ExchangeIcon from '@/assets/icons/navigation/ExchangeIcon.vue'
import NewsIcon from '@/assets/icons/navigation/NewsIcon.vue'
import PortfolioIcon from '@/assets/icons/navigation/PortfolioIcon.vue'
import StatsIcon from '@/assets/icons/navigation/StatsIcon.vue'

export default defineComponent({
  name: 'NavBar',

  setup() {
    const router = useRouter()
    const route = useRoute()
    const selectedButton = ref(route.path)

    const navItems = computed(() => [
      { icon: PortfolioIcon, text: 'Портфель', route: '/' },
      { icon: ExchangeIcon, text: 'Обмен', route: '/exchange' },
      { icon: StatsIcon, text: 'Валюты', route: '/stats' },
      { icon: NewsIcon, text: 'Инфо', route: '/news' },
    ])

    const navigate = (route: string) => {
      useWebAppHapticFeedback().impactOccurred('light')
      router.push(route)
    }

    watch(
      () => route.path,
      (newPath) => {
        selectedButton.value = newPath
      },
    )

    return { navItems, selectedButton, navigate }
  },
})
</script>

<style scoped lang="postcss">
.navbar {
  position: fixed;
  bottom: 0;
  left: 0;
  box-sizing: border-box;
  right: 0;
  padding: calc(var(--safe-area-inset-bottom) + 10px) 18px;
  max-width: 640px;
  margin: 0 auto;
  display: flex;
  transform: translateZ(0);
  will-change: transform;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  font-family: 'SF UI Display', sans-serif;
  z-index: 1000;

  &__nav-button {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #b1c1d2;
    width: 56px;
    height: 56px;
    background-color: #1e2949;
    border-radius: 12px;
    cursor: pointer;
    transition:
      width 0.5s ease,
      background-color 0.5s ease;
  }
  &__nav-button--expanded {
    width: 148px;
    background: linear-gradient(90deg, #6845e9, #00a5fd);
    color: white;
  }

  &__nav-button-icon {
    width: 24px;
    aspect-ratio: 1;
  }

  &__nav-button-text {
    font-weight: 500;
    margin-left: 8px;
    font-size: 16px;
  }
}
</style>
