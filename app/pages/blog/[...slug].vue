<template>
  <div class="post-page">
    <article v-if="post">
      <NuxtLink to="/blog" class="back-link">&larr; Back to Blog</NuxtLink>
      <header>
        <time>{{ formatDate(post.date) }}</time>
        <h1>{{ post.title }}</h1>
      </header>
      <div class="prose">
        <ContentRenderer :value="post" />
      </div>
    </article>
    <SiteFooter />
  </div>
</template>

<script setup>
const route = useRoute()

const { data: post } = await useAsyncData(`blog-${route.path}`, () =>
  queryCollection('blog').path(route.path).first()
)

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found' })
}

useHead({ title: `${post.value?.title ?? 'Post'} — saadso.com` })

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<style scoped>
.post-page {
  max-width: 720px;
  margin: 0 auto;
  padding: clamp(2.5rem, 6vw, 5rem) clamp(1.5rem, 4vw, 3rem);
  min-height: calc(100vh - 60px);
  position: relative;
  z-index: 1;
}

.back-link {
  font-size: 0.6rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
  text-decoration: none;
  transition: color 0.2s ease;
  display: inline-block;
  margin-bottom: 2rem;
  opacity: 0;
  animation: fadeUp 0.5s ease forwards 0.1s;
}
.back-link:hover {
  color: var(--lilac);
}

header {
  margin-bottom: 2.5rem;
  opacity: 0;
  animation: fadeUp 0.8s ease forwards 0.2s;
}

header time {
  font-size: 0.6rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
}

header h1 {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 300;
  font-size: clamp(2rem, 5vw, 3rem);
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin-top: 0.5rem;
}
</style>

<style>
/* Prose styles for rendered markdown (unscoped so they apply to ContentRenderer output) */
.prose {
  opacity: 0;
  animation: fadeUp 0.8s ease forwards 0.4s;
}

.prose h1,
.prose h2,
.prose h3,
.prose h4 {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 400;
  line-height: 1.25;
  letter-spacing: -0.01em;
  margin: 2rem 0 0.8rem;
}

.prose h1 { font-size: clamp(1.6rem, 4vw, 2.2rem); }
.prose h2 { font-size: clamp(1.3rem, 3vw, 1.7rem); }
.prose h3 { font-size: clamp(1.1rem, 2.5vw, 1.3rem); }
.prose h4 { font-size: 1rem; }

.prose p {
  font-size: clamp(0.72rem, 1.1vw, 0.82rem);
  line-height: 1.8;
  margin: 1rem 0;
  letter-spacing: 0.01em;
}

.prose a {
  color: var(--lilac);
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: opacity 0.2s ease;
}
.prose a:hover {
  opacity: 0.75;
}

.prose strong {
  font-weight: 600;
  color: var(--ink);
}

.prose em {
  font-style: italic;
}

.prose ul,
.prose ol {
  margin: 1rem 0;
  padding-left: 1.4rem;
}

.prose li {
  font-size: clamp(0.72rem, 1.1vw, 0.82rem);
  line-height: 1.8;
  margin: 0.3rem 0;
}

.prose li::marker {
  color: var(--lilac);
}

.prose blockquote {
  border-left: 2px solid var(--lilac);
  margin: 1.5rem 0;
  padding: 0.5rem 1.2rem;
  color: var(--muted);
  font-style: italic;
}

.prose blockquote p {
  margin: 0.3rem 0;
}

.prose code {
  font-family: 'Geist Mono', monospace;
  font-size: 0.85em;
  background: rgba(184, 169, 217, 0.1);
  border: 1px solid rgba(184, 169, 217, 0.15);
  padding: 0.15em 0.4em;
  border-radius: 3px;
}

.prose pre {
  background: rgba(184, 169, 217, 0.08);
  border: 1px solid rgba(184, 169, 217, 0.12);
  border-radius: 6px;
  padding: 1.2rem;
  margin: 1.5rem 0;
  overflow-x: auto;
}

.prose pre code {
  background: none;
  border: none;
  padding: 0;
  font-size: clamp(0.62rem, 0.9vw, 0.72rem);
  line-height: 1.7;
}

.prose hr {
  border: none;
  border-top: 1px solid rgba(184, 169, 217, 0.15);
  margin: 2rem 0;
}

.prose img {
  max-width: 100%;
  border-radius: 6px;
  margin: 1.5rem 0;
}
</style>
