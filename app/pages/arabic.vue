<template>
  <div class="arabic-page">

    <!-- Top-right actions -->
    <div class="top-actions">
      <template v-if="!editing">
        <button class="btn" @click="beginEdit">Edit</button>
      </template>
      <template v-else>
        <button class="btn btn-ghost" @click="cancelEdit">Done</button>
      </template>
    </div>

    <!-- Password popover -->
    <div v-if="needsPassword" class="password-popover">
      <div class="password-title">Password</div>
      <input
        v-model="password"
        type="password"
        placeholder="Enter password"
        class="password-input"
        @keyup.enter="confirmPassword"
        autofocus
      />
      <p v-if="authError" class="pw-error">Wrong password</p>
      <div class="password-actions">
        <button class="btn btn-primary" @click="confirmPassword">Confirm</button>
        <button class="btn btn-ghost" @click="needsPassword = false; authError = false">Cancel</button>
      </div>
    </div>

    <!-- Entry list -->
    <div class="entries">
      <div v-if="!entries.length && !editing" class="empty">
        No entries yet.
      </div>

      <div v-for="entry in entries" :key="entry.id" class="card">
        <!-- View mode -->
        <template v-if="editingId !== entry.id">
          <img v-if="entry.image" :src="entry.image" class="card-image" :alt="entry.translation" />
          <div class="card-body">
            <p class="arabic-text" dir="rtl" lang="ar">{{ entry.arabic }}</p>
            <p class="translation-text">{{ entry.translation }}</p>
          </div>
          <div v-if="editing" class="card-edit-actions">
            <button class="btn-sm" @click="startEditEntry(entry)">Edit</button>
            <button class="btn-sm btn-sm-danger" @click="deleteEntry(entry.id)">Delete</button>
          </div>
        </template>

        <!-- Inline edit mode -->
        <template v-else>
          <div class="entry-editor">
            <div class="editor-field">
              <label>Arabic</label>
              <textarea
                v-model="draftEntry.arabic"
                dir="rtl"
                lang="ar"
                class="arabic-input"
                placeholder="اكتب هنا..."
                rows="2"
              />
            </div>
            <div class="editor-field">
              <label>Translation</label>
              <input v-model="draftEntry.translation" class="text-input" placeholder="English translation" />
            </div>
            <div class="editor-field">
              <label>Image</label>
              <div class="image-row">
                <input
                  v-model="draftEntry.image"
                  class="text-input"
                  placeholder="URL or upload below"
                />
                <label class="upload-btn">
                  {{ uploading ? 'Uploading...' : 'Upload' }}
                  <input
                    type="file"
                    accept="image/*"
                    style="display:none"
                    :disabled="uploading"
                    @change="uploadImage"
                  />
                </label>
              </div>
              <img v-if="draftEntry.image" :src="draftEntry.image" class="image-preview" />
            </div>
            <div class="editor-actions">
              <button class="btn btn-primary" :disabled="saving" @click="saveEntry">
                {{ saving ? 'Saving...' : 'Save' }}
              </button>
              <button class="btn btn-ghost" @click="cancelEntryEdit">Cancel</button>
            </div>
            <p v-if="saveError" class="save-error">{{ saveError }}</p>
          </div>
        </template>
      </div>

      <!-- Add new entry (edit mode only) -->
      <div v-if="editing && editingId !== '__new__'" class="add-card" @click="startNewEntry">
        <span class="add-icon">+</span>
        <span class="add-label">Add entry</span>
      </div>

      <!-- New entry editor -->
      <div v-if="editingId === '__new__'" class="card">
        <div class="entry-editor">
          <div class="editor-field">
            <label>Arabic</label>
            <textarea
              v-model="draftEntry.arabic"
              dir="rtl"
              lang="ar"
              class="arabic-input"
              placeholder="اكتب هنا..."
              rows="2"
            />
          </div>
          <div class="editor-field">
            <label>Translation</label>
            <input v-model="draftEntry.translation" class="text-input" placeholder="English translation" />
          </div>
          <div class="editor-field">
            <label>Image</label>
            <div class="image-row">
              <input
                v-model="draftEntry.image"
                class="text-input"
                placeholder="URL or upload below"
              />
              <label class="upload-btn">
                {{ uploading ? 'Uploading...' : 'Upload' }}
                <input
                  type="file"
                  accept="image/*"
                  style="display:none"
                  :disabled="uploading"
                  @change="uploadImage"
                />
              </label>
            </div>
            <img v-if="draftEntry.image" :src="draftEntry.image" class="image-preview" />
          </div>
          <div class="editor-actions">
            <button class="btn btn-primary" :disabled="saving" @click="saveEntry">
              {{ saving ? 'Saving...' : 'Save' }}
            </button>
            <button class="btn btn-ghost" @click="cancelEntryEdit">Cancel</button>
          </div>
          <p v-if="saveError" class="save-error">{{ saveError }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({ title: 'Arabic — saadso.com' })

const entries = ref([])
const editing = ref(false)
const editingId = ref(null)
const draftEntry = ref({ id: '', arabic: '', translation: '', image: '' })

const needsPassword = ref(false)
const password = ref('')
const authError = ref(false)

const saving = ref(false)
const uploading = ref(false)
const saveError = ref('')

async function loadEntries() {
  try {
    entries.value = await $fetch('/api/zikr')
  } catch {
    entries.value = []
  }
}

onMounted(loadEntries)

function beginEdit() {
  needsPassword.value = true
  authError.value = false
  password.value = ''
}

async function confirmPassword() {
  try {
    await $fetch('/api/auth', { method: 'POST', body: { password: password.value } })
    editing.value = true
    needsPassword.value = false
    authError.value = false
  } catch {
    authError.value = true
  }
}

function cancelEdit() {
  editing.value = false
  editingId.value = null
  saveError.value = ''
}

function startEditEntry(entry) {
  editingId.value = entry.id
  draftEntry.value = { ...entry }
  saveError.value = ''
}

function startNewEntry() {
  editingId.value = '__new__'
  draftEntry.value = { id: '', arabic: '', translation: '', image: '' }
  saveError.value = ''
}

function cancelEntryEdit() {
  editingId.value = null
  saveError.value = ''
}

async function saveEntry() {
  if (!draftEntry.value.arabic.trim()) {
    saveError.value = 'Arabic text is required'
    return
  }

  const entry = { ...draftEntry.value }
  if (!entry.id) {
    entry.id = Date.now().toString(36)
  }

  saving.value = true
  saveError.value = ''
  try {
    await $fetch('/api/zikr', {
      method: 'POST',
      body: { password: password.value, action: 'save', entry },
    })
    await loadEntries()
    editingId.value = null
  } catch (err) {
    saveError.value = err?.statusCode === 401 ? 'Wrong password' : (err?.statusMessage || 'Failed to save')
    if (err?.statusCode === 401) {
      editing.value = false
      needsPassword.value = true
    }
  } finally {
    saving.value = false
  }
}

async function deleteEntry(id) {
  if (!confirm('Delete this entry?')) return
  try {
    await $fetch('/api/zikr', {
      method: 'POST',
      body: { password: password.value, action: 'delete', id },
    })
    await loadEntries()
  } catch (err) {
    if (err?.statusCode === 401) {
      editing.value = false
      needsPassword.value = true
    }
  }
}

async function uploadImage(event) {
  const file = event.target.files?.[0]
  if (!file) return
  uploading.value = true
  try {
    const form = new FormData()
    form.append('file', file)
    form.append('password', password.value)
    const res = await $fetch('/api/zikr/upload', { method: 'POST', body: form })
    draftEntry.value.image = res.url
  } catch (err) {
    saveError.value = err?.statusCode === 401 ? 'Wrong password' : 'Upload failed'
  } finally {
    uploading.value = false
    event.target.value = ''
  }
}
</script>

<style scoped>
.arabic-page {
  min-height: calc(100vh - 60px);
  position: relative;
  z-index: 1;
  padding: clamp(1.5rem, 4vw, 3rem);
  padding-top: 5rem;
  max-width: 680px;
  margin: 0 auto;
}

/* Top-right actions */
.top-actions {
  position: fixed;
  top: 88px;
  right: 24px;
  z-index: 80;
  display: flex;
  gap: 0.75rem;
}

@media (max-width: 480px) {
  .top-actions { top: 74px; right: 16px; }
}

/* Buttons */
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
  text-transform: uppercase;
  transition: all 0.2s ease;
}
.btn:hover { background: rgba(184, 169, 217, 0.16); }
.btn:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-primary { color: var(--ink); background: rgba(184, 169, 217, 0.2); }
.btn-ghost { border-color: var(--lilac-border); color: var(--muted); background: transparent; }

.btn-sm {
  font-family: 'Geist Mono', monospace;
  font-size: 0.5rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.3rem 0.6rem;
  border: 1px solid rgba(184, 169, 217, 0.25);
  border-radius: 3px;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-sm:hover { color: var(--lilac); border-color: var(--lilac); }
.btn-sm-danger:hover { color: #e57373; border-color: #e57373; }

/* Password popover */
.password-popover {
  position: fixed;
  top: 150px;
  right: 24px;
  z-index: 90;
  width: 280px;
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid var(--lilac-border);
  background: rgba(245, 242, 250, 0.92);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
:root.dark .password-popover { background: rgba(12, 9, 23, 0.92); }
@media (max-width: 480px) {
  .password-popover { right: 16px; width: calc(100vw - 32px); }
}
.password-title {
  font-family: 'Geist Mono', monospace;
  font-size: 0.62rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--lilac);
  margin-bottom: 0.55rem;
}
.password-input {
  width: 100%;
  border: 1px solid var(--lilac-border);
  background: transparent;
  border-radius: 6px;
  padding: 0.6rem 0.7rem;
  font-family: 'Geist Mono', monospace;
  font-size: 0.8rem;
  color: var(--ink);
  outline: none;
}
.password-actions {
  display: flex;
  gap: 0.6rem;
  margin-top: 0.7rem;
}
.pw-error {
  font-size: 0.55rem;
  color: #e57373;
  letter-spacing: 0.08em;
  margin-top: 0.4rem;
}

/* Entries */
.entries {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.empty {
  text-align: center;
  color: var(--muted);
  font-size: 0.62rem;
  letter-spacing: 0.1em;
  padding: 4rem 0;
}

/* Card */
.card {
  border: 1px solid var(--lilac-border);
  border-radius: 12px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.45);
  transition: border-color 0.2s ease;
  opacity: 0;
  animation: fadeUp 0.6s ease forwards;
}
:root.dark .card { background: rgba(12, 9, 23, 0.3); }
.card:hover { border-color: rgba(184, 169, 217, 0.35); }

.card-image {
  width: 100%;
  max-height: 320px;
  object-fit: cover;
  display: block;
}

.card-body {
  padding: 1.6rem 1.8rem 1.4rem;
}

.arabic-text {
  font-family: 'Amiri', 'Noto Naskh Arabic', serif;
  font-size: clamp(1.6rem, 4vw, 2.2rem);
  line-height: 1.7;
  color: var(--ink);
  text-align: right;
  direction: rtl;
  margin-bottom: 0.9rem;
}

.translation-text {
  font-family: 'Geist Mono', monospace;
  font-size: clamp(0.62rem, 1vw, 0.72rem);
  color: var(--muted);
  letter-spacing: 0.06em;
  line-height: 1.6;
}

.card-edit-actions {
  display: flex;
  gap: 0.4rem;
  padding: 0.75rem 1.2rem;
  border-top: 1px solid var(--lilac-border);
  background: rgba(184, 169, 217, 0.03);
}

/* Entry editor */
.entry-editor {
  padding: 1.4rem 1.6rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.editor-field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.editor-field label {
  font-size: 0.52rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
}

.arabic-input {
  font-family: 'Amiri', 'Noto Naskh Arabic', serif;
  font-size: 1.3rem;
  line-height: 1.7;
  direction: rtl;
  text-align: right;
  background: transparent;
  border: 1px solid var(--lilac-border);
  border-radius: 6px;
  color: var(--ink);
  padding: 0.6rem 0.8rem;
  outline: none;
  resize: vertical;
  transition: border-color 0.2s ease;
  width: 100%;
}
.arabic-input:focus { border-color: var(--lilac); }

.text-input {
  font-family: 'Geist Mono', monospace;
  font-size: 0.68rem;
  background: transparent;
  border: 1px solid var(--lilac-border);
  border-radius: 6px;
  color: var(--ink);
  padding: 0.5rem 0.7rem;
  outline: none;
  transition: border-color 0.2s ease;
  flex: 1;
  min-width: 0;
}
.text-input:focus { border-color: var(--lilac); }

.image-row {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.upload-btn {
  font-family: 'Geist Mono', monospace;
  font-size: 0.52rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.5rem 0.8rem;
  border: 1px solid var(--lilac-border);
  border-radius: 6px;
  color: var(--lilac);
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
  background: rgba(184, 169, 217, 0.06);
}
.upload-btn:hover { background: rgba(184, 169, 217, 0.14); }

.image-preview {
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  border-radius: 6px;
  margin-top: 0.3rem;
  border: 1px solid var(--lilac-border);
}

.editor-actions {
  display: flex;
  gap: 0.5rem;
}

.save-error {
  font-size: 0.55rem;
  color: #e57373;
  letter-spacing: 0.08em;
}

/* Add card */
.add-card {
  border: 1px dashed var(--lilac-border);
  border-radius: 12px;
  padding: 1.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  cursor: pointer;
  color: var(--muted);
  transition: all 0.2s ease;
  background: transparent;
}
.add-card:hover {
  border-color: var(--lilac);
  color: var(--lilac);
  background: rgba(184, 169, 217, 0.04);
}
.add-icon {
  font-size: 1.1rem;
  line-height: 1;
}
.add-label {
  font-size: 0.58rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
</style>
