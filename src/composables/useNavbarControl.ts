import { onMounted } from 'vue'
import { useNavbarStore } from '@/stores/navbarStore'

export function useNavbarControl() {
  const navbar = useNavbarStore()

  onMounted(() => {
    if (navbar.isOpen) {
      navbar.isOpen = false
    }
  })
}
