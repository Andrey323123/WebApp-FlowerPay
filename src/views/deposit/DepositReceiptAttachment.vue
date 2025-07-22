<template>
  <div class="receipt-view">
    <span class="title">Прикрипите чек</span>
    <div class="input-wrapper">
      <div class="file-input">
        <input type="file" class="hidden-input" accept="image/*" @change="handleFileChange" />
        <div class="custom-input">
          <span class="placeholder-text">{{ truncatedFileName }}</span>
          <svg
            width="24"
            height="16"
            viewBox="0 0 24 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.53067 0.0040692C8.00907 -0.0435957 8.4 0.334009 8.4 0.794326C8.4 1.25464 8.00847 1.62222 7.5316 1.68222C6.9557 1.75477 6.39095 1.89924 5.852 2.11289C5.04419 2.43309 4.31017 2.90245 3.6919 3.49419C3.07363 4.08587 2.5832 4.78837 2.24857 5.56145C1.91396 6.3346 1.74175 7.1632 1.74175 8C1.74175 8.8368 1.91396 9.6654 2.24857 10.4386C2.5832 11.2116 3.07363 11.9141 3.6919 12.5058C4.31017 13.0976 5.04419 13.5669 5.852 13.8871C6.39095 14.1008 6.9557 14.2452 7.5316 14.3178C8.00847 14.3778 8.4 14.7454 8.4 15.2057C8.4 15.666 8.00907 16.0436 7.53067 15.9959C6.72587 15.9158 5.93584 15.7247 5.18546 15.4272C4.16633 15.0231 3.24031 14.431 2.4603 13.6845C1.68029 12.938 1.06155 12.0518 0.639404 11.0764C0.217273 10.1011 0 9.05571 0 8C0 6.94429 0.217273 5.89889 0.639404 4.92358C1.06155 3.9482 1.68029 3.06198 2.4603 2.31547C3.24031 1.56902 4.16633 0.976854 5.18546 0.572824C5.93584 0.275339 6.72587 0.0841883 7.53067 0.0040692Z"
              fill="#B1C1D2"
            />
            <path
              d="M15.6 0.794326C15.6 0.334009 15.9909 -0.0435957 16.4693 0.0040692C17.2741 0.0841883 18.0642 0.275339 18.8145 0.572824C19.8337 0.976854 20.7597 1.56902 21.5397 2.31547C22.3197 3.06198 22.9384 3.9482 23.3606 4.92358C23.7827 5.89889 24 6.94429 24 8C24 9.05571 23.7827 10.1011 23.3606 11.0764C22.9384 12.0518 22.3197 12.938 21.5397 13.6845C20.7597 14.431 19.8337 15.0231 18.8145 15.4272C18.0642 15.7247 17.2741 15.9158 16.4693 15.9959C15.9909 16.0436 15.6 15.666 15.6 15.2057C15.6 14.7454 15.9915 14.3778 16.4684 14.3178C17.0443 14.2452 17.6091 14.1008 18.148 13.8871C18.9558 13.5669 19.6898 13.0976 20.3081 12.5058C20.9264 11.9141 21.4168 11.2116 21.7514 10.4386C22.086 9.6654 22.2582 8.8368 22.2582 8C22.2582 7.1632 22.086 6.3346 21.7514 5.56145C21.4168 4.78837 20.9264 4.08587 20.3081 3.49419C19.6898 2.90245 18.9558 2.43309 18.148 2.11289C17.6091 1.89924 17.0443 1.75477 16.4684 1.68222C15.9915 1.62222 15.6 1.25464 15.6 0.794326Z"
              fill="#B1C1D2"
            />
            <path
              d="M5.1 8C5.1 7.52433 5.50294 7.13867 6 7.13867L18 7.13867C18.4971 7.13867 18.9 7.52433 18.9 8C18.9 8.47567 18.4971 8.86133 18 8.86133L6 8.86133C5.50294 8.86133 5.1 8.47567 5.1 8Z"
              fill="#B1C1D2"
            />
          </svg>
        </div>
      </div>
      <transition name="slide-fade">
        <button v-if="selectedFile" class="submit-button" @click="router.push('/deposit/success')">
          Подтвердить
        </button>
        <button v-else class="submit-button" @click="router.push('/')">На главную</button>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNavbarControl } from '@/composables/useNavbarControl'
import router from '@/router'
import { computed, onUnmounted, ref } from 'vue'
import { useWebAppBackButton } from 'vue-tg'

const fileName = ref('')
const selectedFile = ref<File | null>(null)

const truncatedFileName = computed(() => {
  if (!fileName.value) return 'Прикрепить чек'
  return fileName.value.length > 20 ? fileName.value.slice(0, 20) + '...' : fileName.value
})

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    selectedFile.value = input.files[0]
    fileName.value = input.files[0].name
  }
}

const btn = useWebAppBackButton()

if (!btn.isBackButtonVisible) {
  btn.showBackButton()
}

btn.onBackButtonClicked(() => router.back())
useNavbarControl()

onUnmounted(() => {
  btn.hideBackButton()
})
</script>

<style lang="postcss" scoped>
.receipt-view {
  font-family: 'SF Pro Display', sans-serif;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 18px; /* Тёмный фон для страницы */
}

.input-wrapper {
  width: 100%;
  max-width: 300px;
  position: relative;
}
.title {
  font-size: 16px;
  font-weight: 400;
  color: #ffffff;
  margin-bottom: 20px;
}

.file-input {
  width: 100%;
  max-width: 300px;
  position: relative;
}

.hidden-input {
  position: absolute;
  inset: 0; /* Покрывает весь родительский блок */
  opacity: 0;
  cursor: pointer;
  width: 100%;
  z-index: 1;
}

.custom-input {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #1e2949;
  border-radius: 12px;
  padding: 18px 16px;
  height: 64px;
  cursor: pointer;
}

.placeholder-text {
  color: #b1c1d2;
  font-size: 16px;
  font-family: 'SF Pro Display', sans-serif;
}

.icon {
  color: #ffffff;
  font-size: 18px;
}

.submit-button {
  background: #04a2fd;
  border-radius: 12px;
  padding: 14px;
  color: white;
  border: none;
  font-weight: 600;
  width: 100%;
  font-size: 16px;
  cursor: pointer;
  font-family: 'SF Pro Display', sans-serif;
  margin-top: 20px;

  &:hover {
    background: #0389d6;
  }
  transition: background 0.2s ease;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
