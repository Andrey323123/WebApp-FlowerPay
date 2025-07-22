<template>
  <div class="notifications-wrapper">
    <NotificationItem
      v-for="notification in notifications"
      :key="notification.id"
      :notification="notification"
    />
  </div>
</template>

<script setup lang="ts">
import NotificationItem from '@/components/NotificationItem.vue'
import router from '@/router'
import type { User } from '@/types/user'
import { inject, onMounted, ref } from 'vue'
import { useWebAppBackButton } from 'vue-tg'

const axios = inject('axios')
const user = inject<User>('user')

const notifications = ref([])

const getNotifications = async () => {
  try {
    const response = await axios.get('/notification/get/', {
      params: { user_id: user.data.user_id },
    })
    notifications.value = response.data.Nottifications
  } catch (error) {
    console.error('Error occurred:', error)
  }
}

const back = useWebAppBackButton()

back.onBackButtonClicked(() => {
  router.back()
  back.hideBackButton()
})

onMounted(async () => {
  back.showBackButton()
  await getNotifications()
})
</script>

<style lang="postcss" scoped>
.notifications-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 18px;
}
</style>
