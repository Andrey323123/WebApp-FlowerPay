import { onMounted, onBeforeUnmount, ref } from 'vue'

export const useTelegramViewportHack = (elementRef: HTMLElement | null) => {
  const onWindowScroll = () => {
    if (window.scrollY === 0) return
    const shift = document.documentElement.scrollTop
    window.scrollTo(0, 0)
    if (!elementRef || shift === 0) return
    elementRef.scrollTo(0, shift + elementRef.scrollTop)
  }

  const onKeyboardToggle = (e: Event) => {
    e.stopPropagation()
    e.preventDefault()
    window.removeEventListener('scroll', onWindowScroll)
    window.addEventListener('scroll', onWindowScroll)
  }

  onMounted(() => {
    if (!elementRef) return
    elementRef.addEventListener('keyboard:show', onKeyboardToggle)
    elementRef.addEventListener('keyboard:hide', onKeyboardToggle)
  })

  onBeforeUnmount(() => {
    if (!elementRef) return
    elementRef.removeEventListener('keyboard:show', onKeyboardToggle)
    elementRef.removeEventListener('keyboard:hide', onKeyboardToggle)
    window.removeEventListener('scroll', onWindowScroll)
  })
}
