<template>
  <div class="min-h-screen bg-gray-50 flex flex-col md:flex-row">
    <aside class="w-full md:w-56 shrink-0 bg-white border-b md:border-b-0 md:border-r border-gray-200 flex flex-col">
      <div class="h-14 flex items-center px-5 border-b border-gray-200">
        <span class="font-bold text-indigo-600">ContentSched</span>
      </div>
      <nav aria-label="Main navigation" class="flex md:block md:flex-1 gap-1 p-3 md:space-y-1 overflow-x-auto">
        <RouterLink v-for="item in nav" :key="item.path" :to="item.path"
          class="flex shrink-0 items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition"
          exact-active-class="bg-indigo-50 text-indigo-600">
          {{ item.icon }} {{ item.label }}
        </RouterLink>
      </nav>
    </aside>
    <main class="flex-1 min-w-0 p-4 md:p-8">
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
