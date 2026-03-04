<template>
  <div class="min-h-screen bg-gray-50 flex">
    <aside class="w-56 bg-white border-r border-gray-200 flex flex-col">
      <div class="h-14 flex items-center px-5 border-b border-gray-200">
        <span class="font-bold text-indigo-600">ContentSched</span>
      </div>
      <nav class="flex-1 p-3 space-y-1">
        <RouterLink v-for="item in nav" :key="item.path" :to="item.path"
          class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition"
          active-class="bg-indigo-50 text-indigo-600">
          {{ item.icon }} {{ item.label }}
        </RouterLink>
      </nav>
    </aside>
    <main class="flex-1 p-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const nav = [
  { path: '/', label: 'Calendar', icon: '📅' },
  { path: '/queue', label: 'Queue', icon: '📋' },
  { path: '/compose', label: 'Compose', icon: '✏️' },
]
</script>
