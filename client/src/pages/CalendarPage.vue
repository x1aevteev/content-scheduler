<template>
  <AppLayout>
    <div>
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Calendar</h1>
        <RouterLink to="/compose" class="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
          + Schedule Post
        </RouterLink>
      </div>

      <div class="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div class="flex items-center justify-between mb-4">
          <button @click="prevMonth" class="text-gray-500 hover:text-gray-900 px-2">←</button>
          <span class="font-semibold text-gray-800">{{ monthLabel }}</span>
          <button @click="nextMonth" class="text-gray-500 hover:text-gray-900 px-2">→</button>
        </div>
        <div class="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mb-2">
          <div v-for="d in ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']" :key="d">{{ d }}</div>
        </div>
        <div class="grid grid-cols-7 gap-1">
          <div v-for="(day, i) in calendarDays" :key="i"
            class="aspect-square rounded-lg flex flex-col items-center justify-center text-sm relative"
            :class="day ? 'hover:bg-gray-50 cursor-pointer' : ''">
            <span v-if="day" :class="isToday(day) ? 'bg-indigo-600 text-white rounded-full w-7 h-7 flex items-center justify-center' : 'text-gray-700'">
              {{ day }}
            </span>
            <div v-if="day && postsOnDay(day).length" class="absolute bottom-1 flex gap-0.5">
              <div v-for="p in postsOnDay(day).slice(0,3)" :key="p.id" class="w-1.5 h-1.5 rounded-full"
                :class="p.status === 'published' ? 'bg-green-500' : 'bg-indigo-500'" />
            </div>
          </div>
        </div>
      </div>

      <h2 class="font-semibold text-gray-800 mb-3">Scheduled This Month</h2>
      <div class="space-y-2">
        <div v-for="post in scheduledThisMonth" :key="post.id"
          class="bg-white rounded-lg border border-gray-200 px-4 py-3 flex items-center justify-between">
          <div>
            <div class="font-medium text-gray-900 text-sm">{{ post.title }}</div>
            <div class="text-xs text-gray-400 mt-0.5">{{ post.platform }} · {{ new Date(post.scheduled_at!).toLocaleDateString() }}</div>
          </div>
          <span class="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">scheduled</span>
        </div>
        <p v-if="!scheduledThisMonth.length" class="text-gray-400 text-sm text-center py-6">No posts scheduled this month</p>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '@/components/AppLayout.vue'
import { usePostsStore } from '@/stores/posts'

const posts = usePostsStore()
onMounted(() => posts.fetch())

const now = new Date()
const currentYear = ref(now.getFullYear())
const currentMonth = ref(now.getMonth())

const monthLabel = computed(() => new Date(currentYear.value, currentMonth.value).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }))

function prevMonth() { if (currentMonth.value === 0) { currentMonth.value = 11; currentYear.value-- } else currentMonth.value-- }
function nextMonth() { if (currentMonth.value === 11) { currentMonth.value = 0; currentYear.value++ } else currentMonth.value++ }

const calendarDays = computed(() => {
  const first = new Date(currentYear.value, currentMonth.value, 1).getDay()
  const last = new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
  return [...Array(first).fill(null), ...Array.from({ length: last }, (_, i) => i + 1)]
})

function isToday(day: number) {
  const t = new Date()
  return t.getFullYear() === currentYear.value && t.getMonth() === currentMonth.value && t.getDate() === day
}

function postsOnDay(day: number) {
  return posts.posts.filter(p => {
    if (!p.scheduled_at) return false
    const d = new Date(p.scheduled_at)
    return d.getFullYear() === currentYear.value && d.getMonth() === currentMonth.value && d.getDate() === day
  })
}

const scheduledThisMonth = computed(() =>
  posts.posts.filter(p => {
    if (!p.scheduled_at || p.status !== 'scheduled') return false
    const d = new Date(p.scheduled_at)
    return d.getFullYear() === currentYear.value && d.getMonth() === currentMonth.value
  })
)
</script>
