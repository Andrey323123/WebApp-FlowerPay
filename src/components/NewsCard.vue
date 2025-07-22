<template>
  <div class="news-card">
    <div class="news-image" :style="{ backgroundImage: `url(${imageUrl})` }"></div>
    <div class="news-content">
      <div class="news-meta">
        <div class="news-category">{{ categoryName[category] }}</div>
        <div class="news-date">{{ new Date(date).toLocaleDateString() }}</div>
      </div>
      <div class="news-title">{{ title }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'NewsCard',
  props: {
    imageUrl: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  setup() {
    const categoryName = {
      0: 'Crypto',
      1: 'Обновления',
      2: 'Образование',
      3: 'Все',
    }
    return { categoryName }
  },
})
</script>

<style scoped>
.news-card {
  cursor: pointer;
  background-color: #1e2949;
  color: #ffffff;
  border-radius: 24px;
  margin-top: 18px;
}

.news-meta {
  display: flex;
  align-items: baseline;
  gap: 8px;
}
.news-image {
  border-radius: 25px 25px 0 0;
  height: 180px;
  background-size: cover;
  background-position: center;
}

.news-content {
  padding: 16px;
}

.news-category {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  color: #04a2fd;
  font-size: 12px;
  margin-bottom: 4px;
}

.news-date {
  font-family: 'Inter', sans-serif;
  font-weight: normal;
  color: #a0a4b0;
  font-size: 12px;
  margin-bottom: 8px;
}

.news-title {
  font-family: 'SF Pro Display', sans-serif;
  font-weight: bold;
  font-size: 18px;
  line-height: 1.2;
}
</style>
