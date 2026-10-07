<template>
  <AppLayout>
    <div class="max-w-2xl mx-auto">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Compose Post</h1>

      <fieldset :disabled="saving || generating" class="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input v-model="form.title" type="text" class="input" placeholder="Post title" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Platform</label>
          <select v-model="form.platform" class="input">
            <option value="twitter">Twitter / X</option>
            <option value="linkedin">LinkedIn</option>
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
          </select>
        </div>

        <div>
          <div class="flex items-center justify-between mb-1">
            <label class="text-sm font-medium text-gray-700">Content</label>
            <button @click="openAiGenerate" :disabled="generating"
              class="text-xs text-indigo-600 hover:text-indigo-800 font-medium disabled:opacity-50">
              {{ generating ? '✨ Generating...' : '✨ Generate with AI' }}
            </button>
          </div>
          <div v-if="showAiPanel" class="mb-2 flex gap-2">
            <input v-model="aiTopic" type="text" class="input flex-1" placeholder="Topic to write about..." />
            <button @click="generate" class="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm">Go</button>
          </div>
          <textarea v-model="form.content" rows="6" class="input resize-none" placeholder="Write your post..." />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select v-model="form.status" class="input">
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Schedule Date</label>
            <input v-model="form.scheduled_at" type="datetime-local" class="input" :disabled="form.status !== 'scheduled'" />
          </div>
        </div>

        <p v-if="saved" class="text-green-600 text-sm">Post saved!</p>
        <p v-if="error" role="alert" class="text-red-600 text-sm">{{ error }}</p>

        <button @click="save" class="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
          {{ saving ? 'Saving...' : 'Save Post' }}
        </button>
      </fieldset>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import { usePostsStore, type Post } from '@/stores/posts'

const posts = usePostsStore()
const form = reactive({ title: '', content: '', platform: 'twitter', status: 'draft' as Post['status'], scheduled_at: '' })
const generating = ref(false)
const showAiPanel = ref(false)
const aiTopic = ref('')
const saved = ref(false)
const saving = ref(false)
const error = ref('')

function openAiGenerate() {
  showAiPanel.value = !showAiPanel.value
}

async function generate() {
  if (!aiTopic.value.trim() || generating.value || saving.value) return
  error.value = ''
  generating.value = true
  try {
    form.content = await posts.generate(aiTopic.value.trim(), form.platform)
    showAiPanel.value = false
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Unable to generate content.'
  } finally {
    generating.value = false
  }
}

async function save() {
  if (saving.value || generating.value) return
  saving.value = true
  saved.value = false
  error.value = ''
  try {
    await posts.create({ ...form, scheduled_at: form.scheduled_at || null })
    saved.value = true
    setTimeout(() => saved.value = false, 2000)
    Object.assign(form, { title: '', content: '', platform: 'twitter', status: 'draft', scheduled_at: '' })
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Unable to save post.'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.input { @apply w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500; }
</style>
