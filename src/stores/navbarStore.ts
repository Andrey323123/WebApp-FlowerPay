import { defineStore } from 'pinia'

export const useNavbarStore = defineStore('navbar', {
  state: () => ({
    isOpen: true,
    activeTab: '/', // или текущая активная вкладка
  }),
  actions: {
    toggleNavbar() {
      this.isOpen = !this.isOpen
    },
    setActiveTab(tab: string) {
      this.activeTab = tab
    },
    setIsOpen(value: boolean) {
      console.log('Navbar setIsOpen called with value:', value)
      console.trace()
      this.isOpen = value
    },
  },
})
