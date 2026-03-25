<template>
  <nav class="navbar">
    <NuxtLink to="/" class="navbar-logo">
      <SiteLogo />
    </NuxtLink>
    <div class="navbar-links">
      <NuxtLink to="/" :class="{ active: route.path === '/' }">Home</NuxtLink>
      <NuxtLink to="/about" :class="{ active: route.path === '/about' }">About</NuxtLink>
      <NuxtLink to="/blog" :class="{ active: route.path.startsWith('/blog') }">Blog</NuxtLink>
      <NuxtLink to="/links" :class="{ active: route.path === '/links' }">Links</NuxtLink>
      <NuxtLink to="/arabic" :class="{ active: route.path === '/arabic' }">Arabic</NuxtLink>
      <ThemeToggle />
    </div>
  </nav>
</template>

<script setup>
const route = useRoute()
</script>
