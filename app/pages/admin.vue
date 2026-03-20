<template>
  <div class="admin-page">
    <!-- Password gate -->
    <div v-if="!authenticated" class="auth-gate">
      <h1>Admin</h1>
      <div class="auth-form">
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="auth-input"
          @keyup.enter="authenticate"
        />
        <button class="btn" @click="authenticate">Enter</button>
      </div>
      <p v-if="authError" class="error-msg">Wrong password</p>
    </div>

    <!-- Editor -->
    <div v-else>
      <div class="admin-header">
        <h1>Write</h1>
        <div class="admin-actions">
          <button class="btn btn-publish" :disabled="publishing" @click="publish">
            {{ publishing ? 'Publishing...' : 'Publish' }}
          </button>
          <button class="btn btn-ghost" @click="copyMarkdown">{{ copied ? 'Copied!' : 'Copy MD' }}</button>
          <NuxtLink to="/blog" class="btn btn-ghost">Blog</NuxtLink>
        </div>
      </div>

      <p v-if="statusMsg" :class="['status-msg', statusOk ? 'status-ok' : 'status-err']">{{ statusMsg }}</p>

      <div class="meta-row">
        <div class="meta-field">
          <label>Title</label>
          <input v-model="title" placeholder="My Post Title" />
        </div>
        <div class="meta-field">
          <label>Slug</label>
          <input v-model="slug" placeholder="my-post-slug" />
        </div>
        <div class="meta-field">
          <label>Date</label>
          <input v-model="date" type="date" />
        </div>
      </div>

      <div class="meta-row">
        <div class="meta-field full">
          <label>Description</label>
          <input v-model="description" placeholder="A short summary of the post" />
        </div>
      </div>

      <div class="editor-layout">
        <div class="editor-pane">
          <div class="pane-label">Markdown</div>
          <textarea
            v-model="content"
            placeholder="Start writing..."
            spellcheck="false"
          />
        </div>
        <div class="preview-pane">
          <div class="pane-label">Preview</div>
          <div class="prose preview-content" v-html="renderedHtml" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { marked } from 'marked'

useHead({ title: 'Admin — saadso.com' })

// Auth state
const password = ref('')
const authenticated = ref(false)
const authError = ref(false)

// Post fields
const title = ref('')
const slug = ref('')
const description = ref('')
const date = ref(new Date().toISOString().split('T')[0])
const content = ref('')

// UI state
const publishing = ref(false)
const copied = ref(false)
const statusMsg = ref('')
const statusOk = ref(true)

// Auto-generate slug from title
watch(title, (val) => {
  if (val) {
    slug.value = val
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }
})

const renderedHtml = computed(() => {
  return marked.parse(content.value || '')
})

function authenticate() {
  // We'll verify the password server-side on publish.
  // For the gate, just store it and let them in.
  // The real check happens when they try to publish.
  if (password.value) {
    authenticated.value = true
    authError.value = false
  }
}

async function publish() {
  if (!slug.value || !title.value || !content.value) {
    statusMsg.value = 'Fill in title, slug, and content'
    statusOk.value = false
    return
  }

  publishing.value = true
  statusMsg.value = ''

  try {
    const res = await $fetch('/api/blog', {
      method: 'POST',
      body: {
        password: password.value,
        slug: slug.value,
        title: title.value,
        description: description.value,
        date: date.value,
        tags: [],
        content: content.value,
      },
    })

    statusMsg.value = `Published! → /blog/${slug.value}`
    statusOk.value = true
  } catch (err) {
    if (err?.statusCode === 401) {
      statusMsg.value = 'Wrong password'
      authenticated.value = false
    } else {
      statusMsg.value = err?.statusMessage || 'Failed to publish'
    }
    statusOk.value = false
  } finally {
    publishing.value = false
  }
}

function copyMarkdown() {
  const frontmatter = `---\ntitle: ${title.value}\ndescription: ${description.value}\ndate: '${date.value}'\ntags: []\n---\n\n`
  navigator.clipboard.writeText(frontmatter + content.value)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
</script>

<style scoped>
.admin-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem clamp(1.5rem, 4vw, 3rem);
  min-height: calc(100vh - 60px);
  position: relative;
  z-index: 1;
}

/* Auth gate */
.auth-gate {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 1.5rem;
}
.auth-gate h1 {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 300;
  font-size: clamp(2rem, 5vw, 3rem);
  letter-spacing: -0.02em;
}
.auth-form {
  display: flex;
  gap: 0.5rem;
}
.auth-input {
  font-family: 'Geist Mono', monospace;
  font-size: 0.65rem;
  background: transparent;
  border: 1px solid rgba(184, 169, 217, 0.3);
  border-radius: 4px;
  color: var(--ink);
  padding: 0.5rem 0.8rem;
  outline: none;
  width: 200px;
  transition: border-color 0.2s ease;
}
.auth-input:focus {
  border-color: var(--lilac);
}
.error-msg {
  font-size: 0.58rem;
  color: #e57373;
  letter-spacing: 0.08em;
}

/* Header */
.admin-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 1rem;
}
.admin-header h1 {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 300;
  font-size: clamp(1.8rem, 4vw, 2.4rem);
  letter-spacing: -0.02em;
}
.admin-actions {
  display: flex;
  gap: 0.5rem;
}

/* Status message */
.status-msg {
  font-size: 0.58rem;
  letter-spacing: 0.08em;
  margin-bottom: 1rem;
  padding: 0.5rem 0.8rem;
  border-radius: 4px;
}
.status-ok {
  color: #81c784;
  background: rgba(129, 199, 132, 0.08);
  border: 1px solid rgba(129, 199, 132, 0.2);
}
.status-err {
  color: #e57373;
  background: rgba(229, 115, 115, 0.08);
  border: 1px solid rgba(229, 115, 115, 0.2);
}

/* Meta fields */
.meta-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.8rem;
}
.meta-field {
  flex: 1;
}
.meta-field.full {
  flex: 1 1 100%;
}
.meta-field label {
  display: block;
  font-size: 0.52rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 0.3rem;
}
.meta-field input {
  width: 100%;
  font-family: 'Geist Mono', monospace;
  font-size: 0.65rem;
  background: transparent;
  border: 1px solid rgba(184, 169, 217, 0.2);
  border-radius: 4px;
  color: var(--ink);
  padding: 0.45rem 0.6rem;
  outline: none;
  transition: border-color 0.2s ease;
}
.meta-field input:focus {
  border-color: var(--lilac);
}

/* Buttons */
.btn {
  font-family: 'Geist Mono', monospace;
  font-size: 0.58rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.5rem 1rem;
  border: 1px solid var(--lilac);
  border-radius: 4px;
  background: rgba(184, 169, 217, 0.1);
  color: var(--lilac);
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}
.btn:hover { background: rgba(184, 169, 217, 0.2); }
.btn:disabled { opacity: 0.5; cursor: wait; }

.btn-publish {
  background: rgba(184, 169, 217, 0.2);
  font-weight: 600;
}

.btn-ghost {
  border-color: rgba(184, 169, 217, 0.3);
  color: var(--muted);
}
.btn-ghost:hover {
  color: var(--lilac);
  border-color: var(--lilac);
}

/* Editor */
.editor-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  min-height: 55vh;
}
.pane-label {
  font-size: 0.52rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 0.5rem;
}
.editor-pane textarea {
  width: 100%;
  height: calc(100% - 1.5rem);
  min-height: 45vh;
  font-family: 'Geist Mono', monospace;
  font-size: 0.7rem;
  line-height: 1.7;
  background: rgba(184, 169, 217, 0.05);
  border: 1px solid rgba(184, 169, 217, 0.12);
  border-radius: 6px;
  color: var(--ink);
  padding: 1.2rem;
  resize: vertical;
  outline: none;
  transition: border-color 0.2s ease;
}
.editor-pane textarea:focus {
  border-color: rgba(184, 169, 217, 0.3);
}
.preview-pane { overflow: hidden; }
.preview-content {
  height: calc(100% - 1.5rem);
  min-height: 45vh;
  background: rgba(184, 169, 217, 0.03);
  border: 1px solid rgba(184, 169, 217, 0.08);
  border-radius: 6px;
  padding: 1.2rem;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .editor-layout { grid-template-columns: 1fr; }
  .meta-row { flex-direction: column; }
}
</style>
