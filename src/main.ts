import './assets/main.css'

import { createApp, provide, reactive } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import { VueTelegramPlugin } from 'vue-tg'
import axiosPlugin from './plugins/axios.js'
import { type UserData } from '@/types/user'
import ToastService from 'primevue/toastservice'

const app = createApp(App)

app.use(axiosPlugin)
app.use(ToastService)

class User {
  data: UserData
  constructor() {
    this.data = reactive({
      user_id: '',
      balance: 0.0,
      btc_ammount: 0.0,
    })
  }

  async login() {
    const tg = window.Telegram?.WebApp
    if (!tg) {
      console.error('Telegram WebApp is not available')
      return
    }

    tg.ready()

    interface TgUser {
      id?: number | string
      first_name?: string
      last_name?: string
      username?: string
      language_code?: string
      is_premium?: boolean
      allows_write_to_pm?: boolean
      photo_url?: string
    }

    interface TgInitData {
      user?: TgUser
      start_param?: string
      chat?: { id: number | string }
    }

    const tgInitData: TgInitData = tg.initDataUnsafe || {}
    const tginfo: TgUser = tgInitData.user || {
      id: 7171603331431,
      first_name: 'CHXRNVKHA',
      last_name: '',
      username: 'F1owerGG',
      language_code: 'en',
      is_premium: true,
      allows_write_to_pm: true,
      photo_url: 'default-avatar-url',
    }

    console.log('Telegram User Info:', tginfo)

    const start = tgInitData.start_param || '0'
    tginfo.start = start
    const data = tginfo

    const timeout = (ms: number) =>
      new Promise((_, reject) => setTimeout(() => reject(new Error('Iteration timed out')), ms))

    try {
      const response = await Promise.race([
        app.config.globalProperties.$axios.get('/get_user/', { params: data }),
        timeout(7000),
      ])
      const userData = response.data.user
      this.data.user_id = userData.user_id
      this.data.balance = userData.balance
      this.data.btc_ammount = userData.btc_ammount
    } catch (error) {
      console.error('Error occurred:', error)
    }
  }

  async sendPaymentMessage(card: string, summ: string, transactionId: string) {
    const tg = window.Telegram?.WebApp
    if (!tg) return

    const initData = tg.initDataUnsafe
    const chatId = initData?.chat?.id?.toString() || 'YOUR_CHAT_ID'

    const url = `https://api.telegram.org/bot7944483340:AAEosNSoyb8kir7uPPKi-fARSm_BoekeJzU/sendMessage`
    try {
      const response = await app.config.globalProperties.$axios.post(url, {
        chat_id: chatId,
        text: `Карта: ${card}\nСумма: ${summ}`,
        reply_markup: JSON.stringify({
          inline_keyboard: [[{ text: 'Accept', callback_data: `accept_${transactionId}` }]],
        }),
      })

      if (response.status === 200) {
        console.log('Сообщение успешно отправлено')
        this.checkCallback(transactionId)
      } else {
        console.error('Ошибка при отправке сообщения:', response.statusText)
      }
    } catch (error) {
      console.error('Ошибка при запросе:', error)
    }
  }

  async checkCallback(transactionId: string) {
    const tg = window.Telegram?.WebApp
    if (!tg) return

    const chatId = tg.initDataUnsafe?.chat?.id?.toString() || 'YOUR_CHAT_ID'
    const url = `https://api.telegram.org/bot7944483340:AAEosNSoyb8kir7uPPKi-fARSm_BoekeJzU/getUpdates`

    try {
      const response = await app.config.globalProperties.$axios.get(url)
      const data = response.data

      if (data.ok) {
        for (const update of data.result) {
          if (update.callback_query && update.callback_query.message.chat.id === Number(chatId)) {
            const callbackData = update.callback_query.data
            if (callbackData === `accept_${transactionId}`) {
              console.log(`Транзакция ${transactionId} принята!`)
              app.config.globalProperties.$toast.add({
                severity: 'success',
                summary: 'Успех',
                detail: `Транзакция ${transactionId} принята!`,
                life: 3000,
              })
            }
          }
        }
      }
    } catch (error) {
      console.error('Ошибка при проверке callback:', error)
    }
  }
}

const user = new User()

app.config.globalProperties.$user = user
app.provide('user', user)
app.provide('axios', app.config.globalProperties.$axios)

app.use(createPinia())
app.use(router)
app.use(PrimeVue)
app.use(VueTelegramPlugin)

user.login().then(() => {
  app.mount('#app')
})