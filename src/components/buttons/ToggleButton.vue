<template>
  <div :class="['toggle', { 'toggle--on': isOn }]" @click="toggle">
    <div class="toggle__slider"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useWebAppHapticFeedback } from 'vue-tg'

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const isOn = ref(props.modelValue)
const { notificationOccurred } = useWebAppHapticFeedback()

const toggle = () => {
  if (isOn.value) {
    notificationOccurred('warning')
  } else {
    notificationOccurred('success')
  }
  isOn.value = !isOn.value
  emit('update:modelValue', isOn.value)
}

watch(
  () => props.modelValue,
  (newVal) => {
    isOn.value = newVal
  },
)
</script>

<style scoped>
.toggle {
  width: 51px;
  height: 31px;
  border-radius: 15px;
  background-color: #171b36;
  display: flex;
  align-items: center;
  padding: 2px;
  cursor: pointer;
  transition: background-color 0.3s;
  box-sizing: border-box;
}

.toggle--on {
  background-color: #04a2fd;
}

.toggle__slider {
  width: 27px;
  height: 27px;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.3s;
  transform: translateX(0);
}

.toggle--on .toggle__slider {
  transform: translateX(20px);
}
</style>
