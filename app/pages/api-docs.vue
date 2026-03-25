<template>
  <div class="api-docs-page">
    <div class="page-header">
      <h1>API <em>Docs</em></h1>
      <p class="subtitle">All server routes for saadso.com</p>
    </div>

    <div class="routes-list">
      <div v-for="route in routes" :key="route.method + route.path" class="route-card">
        <div class="route-header">
          <span class="method" :class="route.method.toLowerCase()">{{ route.method }}</span>
          <code class="path">{{ route.path }}</code>
          <span v-if="route.auth" class="auth-badge">auth</span>
        </div>
        <p class="description">{{ route.description }}</p>
        <div v-if="route.body || route.returns" class="route-meta">
          <div v-if="route.body" class="meta-row">
            <span class="meta-label">Body</span>
            <code class="meta-value">{{ route.body }}</code>
          </div>
          <div v-if="route.returns" class="meta-row">
            <span class="meta-label">Returns</span>
            <code class="meta-value">{{ route.returns }}</code>
          </div>
        </div>
      </div>
    </div>

    <div class="data-section">
      <h2>Data Storage</h2>
      <div class="storage-table">
        <div class="storage-row header-row">
          <span>Feature</span><span>Storage</span><span>Location</span>
        </div>
        <div class="storage-row">
          <span>Blog posts</span><span>Markdown files</span><span>content/blog/*.md</span>
        </div>
        <div class="storage-row">
          <span>Links canvas</span><span>Markdown file</span><span>content/links.md</span>
        </div>
        <div class="storage-row">
          <span>Zikr entries</span><span>PostgreSQL</span><span>zikr_entries table</span>
        </div>
        <div class="storage-row">
          <span>Uploaded images</span><span>Disk (nginx)</span><span>/var/www/saadso-uploads/</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({ title: 'API Docs — saadso.com' })
const { data: routes } = await useAsyncData('sitemap', () => $fetch('/api/sitemap'))
</script>

<style scoped>
.api-docs-page {
  max-width: 860px;
  margin: 0 auto;
  padding: clamp(2rem, 5vw, 4rem) clamp(1.5rem, 4vw, 3rem);
  min-height: calc(100vh - 60px);
  position: relative;
  z-index: 1;
}

.page-header {
  margin-bottom: 3rem;
  opacity: 0;
  animation: fadeUp 0.8s ease forwards 0.2s;
}

h1 {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 300;
  font-size: clamp(2.2rem, 6vw, 3.6rem);
  line-height: 1;
  letter-spacing: -0.02em;
  margin-bottom: 0.6rem;
}

h1 em {
  font-style: italic;
  color: var(--lilac);
}

h2 {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 300;
  font-size: clamp(1.4rem, 3vw, 2rem);
  letter-spacing: -0.02em;
  margin-bottom: 1rem;
  color: var(--ink);
}

.subtitle {
  font-size: 0.62rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
}

/* Route cards */
.routes-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 3rem;
}

.route-card {
  border: 1px solid var(--lilac-border);
  border-radius: 10px;
  padding: 1rem 1.2rem;
  background: rgba(255,255,255,0.3);
  opacity: 0;
  animation: fadeUp 0.5s ease forwards;
}

:root.dark .route-card {
  background: rgba(12, 9, 23, 0.3);
}

.route-card:nth-child(1)  { animation-delay: 0.3s; }
.route-card:nth-child(2)  { animation-delay: 0.35s; }
.route-card:nth-child(3)  { animation-delay: 0.4s; }
.route-card:nth-child(4)  { animation-delay: 0.45s; }
.route-card:nth-child(5)  { animation-delay: 0.5s; }
.route-card:nth-child(6)  { animation-delay: 0.55s; }
.route-card:nth-child(7)  { animation-delay: 0.6s; }
.route-card:nth-child(8)  { animation-delay: 0.65s; }
.route-card:nth-child(9)  { animation-delay: 0.7s; }
.route-card:nth-child(10) { animation-delay: 0.75s; }
.route-card:nth-child(11) { animation-delay: 0.8s; }

.route-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
}

.method {
  font-family: 'Geist Mono', monospace;
  font-size: 0.52rem;
  letter-spacing: 0.1em;
  font-weight: 600;
  padding: 0.2rem 0.5rem;
  border-radius: 3px;
  text-transform: uppercase;
  flex-shrink: 0;
}

.method.get    { background: rgba(129,199,132,0.15); color: #66bb6a; }
.method.post   { background: rgba(184,169,217,0.18); color: var(--lilac); }
.method.delete { background: rgba(229,115,115,0.15); color: #ef9a9a; }

.path {
  font-family: 'Geist Mono', monospace;
  font-size: 0.72rem;
  color: var(--ink);
  letter-spacing: 0.02em;
}

.auth-badge {
  font-family: 'Geist Mono', monospace;
  font-size: 0.48rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.15rem 0.45rem;
  border: 1px solid rgba(184,169,217,0.3);
  border-radius: 3px;
  color: var(--muted);
}

.description {
  font-size: 0.65rem;
  color: var(--muted);
  line-height: 1.6;
  letter-spacing: 0.02em;
  margin-bottom: 0.5rem;
}

.route-meta {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--lilac-border);
}

.meta-row {
  display: flex;
  gap: 0.75rem;
  align-items: baseline;
}

.meta-label {
  font-size: 0.5rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
  width: 48px;
  flex-shrink: 0;
}

.meta-value {
  font-family: 'Geist Mono', monospace;
  font-size: 0.58rem;
  color: var(--ink);
  opacity: 0.75;
  word-break: break-word;
}

/* Data storage table */
.data-section {
  opacity: 0;
  animation: fadeUp 0.6s ease forwards 0.9s;
}

.storage-table {
  border: 1px solid var(--lilac-border);
  border-radius: 10px;
  overflow: hidden;
}

.storage-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1.5fr;
  gap: 1rem;
  padding: 0.7rem 1.1rem;
  border-bottom: 1px solid var(--lilac-border);
  font-size: 0.62rem;
  letter-spacing: 0.04em;
}

.storage-row:last-child { border-bottom: none; }

.header-row {
  font-size: 0.52rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
  background: rgba(184,169,217,0.05);
}

@media (max-width: 600px) {
  .storage-row { grid-template-columns: 1fr 1fr; }
  .storage-row span:last-child { display: none; }
  .route-header { gap: 0.5rem; }
}
</style>
