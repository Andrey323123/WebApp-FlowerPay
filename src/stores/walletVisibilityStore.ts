// stores/blurStore.ts
import { defineStore } from 'pinia'

export const useBlurStore = defineStore('blur', {
  state: () => ({
    isBlurred: false,
  }),

  actions: {
    toggleBlur() {
      this.isBlurred = !this.isBlurred
    },
    setBlur(value: boolean) {
      this.isBlurred = value
    },
  },
})
