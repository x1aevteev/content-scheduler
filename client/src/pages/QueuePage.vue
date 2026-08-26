<template>
  <AppLayout>
    <div>
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Post Queue</h1>
        <RouterLink to="/compose" class="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
          + New Post
        </RouterLink>
      </div>

      <div class="flex gap-2 mb-5">
        <button v-for="tab in tabs" :key="tab.value" @click="activeTab = tab.value"
          class="px-4 py-1.5 rounded-full text-sm font-medium transition"
          :class="activeTab === tab.value ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'">
          {{ tab.label }} ({{ posts.byStatus(tab.value).length }})
        </button>
      </div>

      <div v-if="posts.loading" class="text-gray-500 text-sm">Loading...</div>

      <div class="space-y-3">
        <div v-for="post in posts.byStatus(activeTab)" :key="post.id"
          class="bg-white rounded-xl border border-gray-200 p-4 flex items-start justify-between gap-4">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs font-medium text-gray-500 uppercase">{{ post.platform }}</span>
              <span class="px-2 py-0.5 rounded-full text-xs font-medium"
                :class="{
                  'bg-yellow-100 text-yellow-700': post.status === 'draft',
                  'bg-blue-100 text-blue-700': post.status === 'scheduled',
                  'bg-green-100 text-green-700': post.status === 'published',
                }">
                {{ post.status }}
              </span>
            </div>
            <h3 class="font-medium text-gray-900 truncate">{{ post.title }}</h3>
            <p class="text-sm text-gray-500 mt-1 line-clamp-2">{{ post.content }}</p>
            <div v-if="post.scheduled_at" class="text-xs text-gray-400 mt-2">
              Scheduled: {{ new Date(post.scheduled_at).toLocaleString() }}
            </div>
          </div>
          <button @click="posts.remove(post.id)" class="text-gray-400 hover:text-red-600 transition text-sm">✕</button>
        </div>
        <p v-if="!posts.byStatus(activeTab).length" class="text-gray-400 text-sm text-center py-10">
          No {{ activeTab }} posts
        </p>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import { usePostsStore } from '@/stores/posts'

const posts = usePostsStore()
const activeTab = ref('draft')
const tabs = [
  { label: 'Drafts', value: 'draft' },
  { label: 'Scheduled', value: 'scheduled' },
  { label: 'Published', value: 'published' },
]

onMounted(() => posts.fetch())
</script>
