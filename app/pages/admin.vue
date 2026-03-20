<template>
  <div class="admin-page">
    <div class="admin-header">
      <h1>Write</h1>
      <div class="admin-actions">
        <button class="btn" @click="copyMarkdown">{{ copied ? 'Copied!' : 'Copy Markdown' }}</button>
        <NuxtLink to="/blog" class="btn btn-ghost">Blog</NuxtLink>
      </div>
    </div>

    <div class="slug-row">
      <label>content/blog/</label>
      <input v-model="slug" placeholder="my-post-slug" class="slug-input" />
      <label>.md</label>
    </div>

    <div class="editor-layout">
      <div class="editor-pane">
        <div class="pane-label">Markdown</div>
        <textarea
          v-model="markdown"
          placeholder="Start writing..."
          spellcheck="false"
        />
      </div>
      <div class="preview-pane">
        <div class="pane-label">Preview</div>
        <div class="prose preview-content" v-html="renderedHtml" />
      </div>
    </div>

    <p class="hint">
      Save as <code>content/blog/{{ slug || 'your-slug' }}.md</code>, commit, push. Auto-deploys.
    </p>
  </div>
</template>

<script setup>
import { marked } from 'marked'

useHead({ title: 'Admin — saadso.com' })

const slug = ref('my-post')
const copied = ref(false)

const defaultFrontmatter = `---
title: My Post Title
description: A short description of this post.
date: '${new Date().toISOString().split('T')[0]}'
tags: []
---

`

const markdown = ref(defaultFrontmatter)

const renderedHtml = computed(() => {
  // Strip frontmatter before rendering preview
  const content = markdown.value.replace(/^---[\s\S]*?---\n*/, '')
  return marked.parse(content)
})

function copyMarkdown() {
  navigator.clipboard.writeText(markdown.value)
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

.admin-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.admin-header h1 {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 300;
  font-size: clamp(1.8rem, 4vw, 2.4rem);
  letter-spacing: -0.02em;
}

.admin-actions {
  display: flex;
  gap: 0.6rem;
}

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
.btn:hover {
  background: rgba(184, 169, 217, 0.2);
}

.btn-ghost {
  border-color: rgba(184, 169, 217, 0.3);
  color: var(--muted);
}
.btn-ghost:hover {
  color: var(--lilac);
  border-color: var(--lilac);
}

.slug-row {
  display: flex;
  align-items: center;
  gap: 0;
  margin-bottom: 1.2rem;
  font-family: 'Geist Mono', monospace;
  font-size: 0.62rem;
  color: var(--muted);
}

.slug-input {
  font-family: 'Geist Mono', monospace;
  font-size: 0.62rem;
  background: transparent;
  border: none;
  border-bottom: 1px solid rgba(184, 169, 217, 0.3);
  color: var(--ink);
  padding: 0.3rem 0.3rem;
  outline: none;
  width: 200px;
  transition: border-color 0.2s ease;
}
.slug-input:focus {
  border-color: var(--lilac);
}

.editor-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  min-height: 60vh;
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
  min-height: 50vh;
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

.preview-pane {
  overflow: hidden;
}

.preview-content {
  height: calc(100% - 1.5rem);
  min-height: 50vh;
  background: rgba(184, 169, 217, 0.03);
  border: 1px solid rgba(184, 169, 217, 0.08);
  border-radius: 6px;
  padding: 1.2rem;
  overflow-y: auto;
}

.hint {
  margin-top: 1.2rem;
  font-size: 0.55rem;
  letter-spacing: 0.08em;
  color: var(--muted);
}
.hint code {
  font-family: 'Geist Mono', monospace;
  background: rgba(184, 169, 217, 0.1);
  padding: 0.15em 0.4em;
  border-radius: 3px;
  font-size: 0.9em;
}

@media (max-width: 768px) {
  .editor-layout {
    grid-template-columns: 1fr;
  }
}
</style>
