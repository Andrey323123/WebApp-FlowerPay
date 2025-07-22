<template>
  <div class="news-feed">
    <NewsSelector @categoryChange="changeCategory" />
    <div class="articles-container">
      <div class="articles">
        <!-- Скелетоны при начальной загрузке -->
        <div v-if="initialLoading" class="skeleton-container">
          <div v-for="n in 4" :key="n" class="news-card skeleton-card">
            <Skeleton height="180px" borderRadius="16px 16px 0px 0px" />
            <div class="news-content">
              <div class="news-meta">
                <Skeleton width="80px" height="16px" class="mb-1" borderRadius="16px" />
                <Skeleton width="100px" height="16px" class="mb-1" borderRadius="16px" />
              </div>
              <Skeleton width="100%" height="60px" borderRadius="16px" />
            </div>
          </div>
        </div>
        <!-- Статьи -->
        <div v-else class="articles-grid">
          <NewsCard
            v-for="article in articles"
            :key="article.id"
            :image-url="default_img"
            :category="article.category.toString()"
            :title="article.name"
            :date="article.created_at"
            @click="() => wa_nav.openLink(article.link)"
          />
        </div>

        <div v-if="hasMore" class="load-more" ref="loadMoreTrigger">
          <div v-if="loading" class="skeleton-container">
            <div class="news-card skeleton-card">
              <Skeleton height="180px" borderRadius="16px 16px 0px 0px" />
              <div class="news-content">
                <div class="news-meta">
                  <Skeleton width="80px" height="16px" class="mb-1" borderRadius="16px" />
                  <Skeleton width="100px" height="16px" class="mb-1" borderRadius="16px" />
                </div>
                <Skeleton width="100%" height="60px" borderRadius="16px" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, inject } from 'vue'
import NewsSelector from '@/components/NewsSelector.vue'
import NewsCard from '@/components/NewsCard.vue'
import default_img from '@/assets/icons/news/default_news_img.png'
import Skeleton from 'primevue/skeleton'
import { useWebAppNavigation } from 'vue-tg'

const wa_nav = useWebAppNavigation()

const axios = inject('axios')
const articles = ref([])
const cursor = ref(1)
const category = ref(3)
const loading = ref(false)
const initialLoading = ref(true)
const hasMore = ref(true)
const loadMoreTrigger = ref(null)

const getNews = async () => {
  if (loading.value) return
  loading.value = true

  try {
    const response = await axios.get('/get_news/', {
      params: {
        cursor: cursor.value,
        category: category.value,
      },
    })

    const { results, next } = response.data

    if (cursor.value === 1) {
      articles.value = results
    } else {
      articles.value.push(...results)
    }

    hasMore.value = !!next
    if (hasMore.value) {
      cursor.value += 1
    }
  } catch (error) {
    console.error('Error:', error)
  } finally {
    loading.value = false
    initialLoading.value = false
  }
}

const changeCategory = (newCategory) => {
  category.value = newCategory
  cursor.value = 1
  articles.value = []
  hasMore.value = true
  initialLoading.value = true
  getNews()
}

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && hasMore.value && !loading.value) {
        getNews()
      }
    },
    { threshold: 0.1 },
  )

  if (loadMoreTrigger.value) {
    observer.observe(loadMoreTrigger.value)
  }

  getNews()

  onUnmounted(() => {
    observer.disconnect()
  })
})
</script>

<style scoped>
.news-feed {
  display: flex;
  flex-direction: column;
  padding: 18px;
  color: #b1c1d2;
  height: 100vh;
}

.articles-container {
  flex: 1;
  overflow-y: auto;
}

.articles {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skeleton-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.skeleton-card {
  padding: 1rem;
  border-radius: 8px;
  background: var(--surface-card);
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
  100% {
    opacity: 1;
  }
}

:deep(.p-skeleton) {
  background-color: #1e2949;

  &::after {
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);
  }
}

.news-card {
  background-color: #1e2949;
  border-radius: 24px;
  margin-top: 18px;
}

.news-content {
  padding: 16px;
}

.news-meta {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.load-more {
  min-height: 100px;
  margin-top: 1rem;
}

.skeleton-card {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
  100% {
    opacity: 1;
  }
}
</style>
