<template>
  <div class="links-canvas-page">
    <div class="canvas-top-actions">
      <button v-if="!editing" class="btn" @click="beginEdit">Edit</button>
      <div v-else class="canvas-edit-actions">
        <button class="btn btn-primary" :disabled="saving" @click="save">
          {{ saving ? 'Saving...' : 'Save' }}
        </button>
        <button class="btn btn-ghost" :disabled="saving" @click="cancelEdit">Cancel</button>
      </div>
    </div>

    <div v-if="needsPassword" class="password-popover">
      <div class="password-title">Password</div>
      <input
        v-model="password"
        type="password"
        placeholder="Enter password"
        class="password-input"
        @keyup.enter="confirmPassword"
      />
      <div class="password-actions">
        <button class="btn btn-primary" @click="confirmPassword">Confirm</button>
        <button
          class="btn btn-ghost"
          @click="needsPassword = false; password = '';"
          :disabled="saving"
        >
          Cancel
        </button>
      </div>
    </div>

    <div class="canvas-wrapper">
      <textarea
        v-model="draft"
        class="canvas-textarea"
        spellcheck="false"
        :readonly="!editing"
        :class="{ 'is-readonly': !editing }"
      ></textarea>

      <div v-if="statusMsg" class="status-msg" :class="statusOk ? 'status-ok' : 'status-err'">
        {{ statusMsg }}
      </div>
      <div v-else class="canvas-hint">
        {{ editing ? 'Edit markdown and press Save.' : 'Click Edit, enter the password, then edit.' }}
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({ title: 'Links — saadso.com' })

const markdown = ref('')
const draft = ref('')

const editing = ref(false)
const authenticated = ref(false)
const needsPassword = ref(false)
const password = ref('')

const saving = ref(false)

const statusMsg = ref('')
const statusOk = ref(true)

async function loadLinks() {
  try {
    markdown.value = await $fetch('/api/links')
  } catch {
    markdown.value = ''
  }
  draft.value = markdown.value
}

onMounted(loadLinks)

function beginEdit() {
  statusMsg.value = ''
  statusOk.value = true
  needsPassword.value = true
  password.value = ''
}

async function confirmPassword() {
  try {
    await $fetch('/api/auth', { method: 'POST', body: { password: password.value } })
    authenticated.value = true
    editing.value = true
    needsPassword.value = false
  } catch {
    statusOk.value = false
    statusMsg.value = 'Wrong password'
    password.value = ''
  }
}

function cancelEdit() {
  editing.value = false
  draft.value = markdown.value
  statusMsg.value = ''
}

async function save() {
  saving.value = true
  statusMsg.value = ''
  statusOk.value = true
  try {
    await $fetch('/api/links', {
      method: 'POST',
      body: {
        password: password.value,
        content: draft.value,
      },
    })
    markdown.value = draft.value
    statusMsg.value = 'Saved!'
  } catch (err) {
    if (err?.statusCode === 401) {
      statusOk.value = false
      statusMsg.value = 'Wrong password'
      // Clear local password so user re-enters next time.
      password.value = ''
      authenticated.value = false
      editing.value = false
      needsPassword.value = true
    } else {
      statusOk.value = false
      statusMsg.value = err?.statusMessage || 'Failed to save'
    }
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.links-canvas-page {
  min-height: calc(100vh - 60px);
  position: relative;
  z-index: 1;
  padding: clamp(1.25rem, 3vw, 2.25rem);
  padding-top: 6rem;
}

.canvas-top-actions {
  position: fixed;
  top: 88px;
  right: 24px;
  z-index: 80;
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

@media (max-width: 480px) {
  .canvas-top-actions {
    top: 74px;
    right: 16px;
  }
}

.canvas-edit-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.btn {
  align-items: center;
  background: rgba(184, 169, 217, 0.08);
  border: 1px solid var(--lilac-border);
  border-radius: 4px;
  color: var(--lilac);
  cursor: pointer;
  display: inline-flex;
  font-family: 'Geist Mono', monospace;
  font-size: 0.58rem;
  letter-spacing: 0.1em;
  padding: 0.55rem 1rem;
  text-decoration: none;
  text-transform: uppercase;
  transition: all 0.2s ease;
}

.btn:hover { background: rgba(184, 169, 217, 0.16); }
.btn:disabled { opacity: 0.6; cursor: not-allowed; }

.btn-primary {
  color: var(--ink);
  background: rgba(184, 169, 217, 0.16);
}

.btn-ghost {
  border-color: var(--lilac-border);
  color: var(--muted);
  background: transparent;
}

.password-popover {
  position: fixed;
  top: 150px;
  right: 24px;
  z-index: 90;
  width: 280px;
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid var(--lilac-border);
  background: rgba(245, 242, 250, 0.85);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

@media (max-width: 480px) {
  .password-popover {
    right: 16px;
    width: calc(100vw - 32px);
  }
}

:root.dark .password-popover {
  background: rgba(12, 9, 23, 0.85);
}

.password-title {
  font-family: 'Geist Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--lilac);
  margin-bottom: 0.55rem;
}

.password-input {
  width: 100%;
  border: 1px solid var(--lilac-border);
  background: transparent;
  border-radius: 8px;
  padding: 0.65rem 0.75rem;
  font-family: 'Geist Mono', monospace;
  font-size: 0.8rem;
  color: var(--ink);
  outline: none;
}

.password-actions {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 0.75rem;
}

.password-hint {
  margin-top: 0.75rem;
  color: var(--muted);
  font-size: 0.7rem;
  letter-spacing: 0.08em;
}

.password-code {
  color: var(--lilac);
  font-weight: 600;
}

.canvas-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.canvas-textarea {
  width: 100%;
  height: calc(100vh - 6rem - 2.25rem);
  min-height: 320px;
  resize: none;
  border: 1px solid var(--lilac-border);
  border-radius: 12px;
  padding: 1.25rem 1.25rem;
  font-family: 'Geist Mono', monospace;
  font-size: 0.9rem;
  line-height: 1.65;
  background: rgba(255, 255, 255, 0.55);
  color: var(--ink);
  outline: none;
}

:root.dark .canvas-textarea {
  background: rgba(12, 9, 23, 0.35);
}

.is-readonly {
  opacity: 0.75;
}

.canvas-hint {
  color: var(--muted);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0 0.25rem;
}

.status-msg {
  padding: 0 0.25rem;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.status-ok { color: var(--lilac); }
.status-err { color: #e57373; }
</style>
