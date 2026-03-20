<template>
  <div class="blog-page">
    <div class="blog-header">
      <h1>Blog</h1>
      <NuxtLink to="/admin" class="write-link">Write</NuxtLink>
    </div>

    <div v-if="posts?.length" class="post-list">
      <NuxtLink
        v-for="post in posts"
        :key="post.path"
        :to="post.path"
        class="post-card"
      >
        <time>{{ formatDate(post.date) }}</time>
        <h2>{{ post.title }}</h2>
        <p v-if="post.description">{{ post.description }}</p>
      </NuxtLink>
    </div>

    <div v-else class="empty">
      <p>Nothing here yet.</p>
    </div>

    <SiteFooter />
  </div>
</template>

<script setup>
useHead({ title: 'Blog — saadso.com' })

const { data: posts } = await useAsyncData('blog-list', () =>
  queryCollection('blog').order('date', 'DESC').all()
)

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<style scoped>
.blog-page {
  max-width: 720px;
  margin: 0 auto;
  padding: clamp(2.5rem, 6vw, 5rem) clamp(1.5rem, 4vw, 3rem);
  min-height: calc(100vh - 60px);
  position: relative;
  z-index: 1;
}

.blog-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 3rem;
  opacity: 0;
  animation: fadeUp 0.8s ease forwards 0.2s;
}

.blog-header h1 {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 300;
  font-size: clamp(2rem, 5vw, 3rem);
  line-height: 1;
  letter-spacing: -0.02em;
}

.write-link {
  font-size: 0.6rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
  text-decoration: none;
  transition: color 0.2s ease;
}
.write-link:hover {
  color: var(--lilac);
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.post-card {
  display: block;
  text-decoration: none;
  color: inherit;
  padding: 1.5rem 0;
  border-top: 1px solid rgba(184, 169, 217, 0.1);
  opacity: 0;
  animation: fadeUp 0.6s ease forwards;
  transition: transform 0.2s ease;
}
.post-card:nth-child(1) { animation-delay: 0.3s; }
.post-card:nth-child(2) { animation-delay: 0.4s; }
.post-card:nth-child(3) { animation-delay: 0.5s; }
.post-card:nth-child(4) { animation-delay: 0.6s; }
.post-card:nth-child(5) { animation-delay: 0.7s; }

.post-card:hover {
  transform: translateX(4px);
}

.post-card time {
  font-size: 0.6rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
}

.post-card h2 {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 400;
  font-size: clamp(1.2rem, 3vw, 1.6rem);
  line-height: 1.3;
  margin: 0.4rem 0 0.3rem;
  letter-spacing: -0.01em;
}

.post-card p {
  font-size: clamp(0.58rem, 0.9vw, 0.68rem);
  color: var(--muted);
  line-height: 1.6;
  letter-spacing: 0.02em;
}

.empty {
  text-align: center;
  padding: 4rem 0;
  color: var(--muted);
  font-size: 0.65rem;
  letter-spacing: 0.1em;
}
</style>
