import { useWebAppBackButton } from 'vue-tg'
import { onMounted, onUnmounted } from 'vue'
import router from '@/router'

export function useBackButton(shouldShow = true) {
  const { showBackButton, hideBackButton, onBackButtonClicked } = useWebAppBackButton()

  // Сохраняем функцию очистки обработчика
  let cleanup: (() => void) | null = null

  onMounted(() => {
    if (shouldShow) {
      showBackButton()
      // Устанавливаем обработчик и сохраняем функцию очистки
      cleanup = onBackButtonClicked(() => {
        router.back()
      })
    } else {
      hideBackButton()
    }
  })

  onUnmounted(() => {
    // Удаляем обработчик если он был установлен
    if (cleanup) {
      cleanup()
    }
    hideBackButton()
  })
}
