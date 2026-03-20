<template>
  <button class="theme-toggle" aria-label="Toggle theme" @click="toggle">
    <svg v-if="!isDark" class="icon-moon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21.752 15.002A9.718 9.718 0 0112.478 24C5.926 24 .597 18.671.597 12.12.597 6.317 4.776 1.47 10.29.378a.75.75 0 01.882.957 7.218 7.218 0 0011.543 8.165.75.75 0 01.963-.123 9.757 9.757 0 01-1.926 5.625z"/></svg>
    <svg v-if="isDark" class="icon-sun" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 17.5a5.5 5.5 0 100-11 5.5 5.5 0 000 11zm0-14.25a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0V4a.75.75 0 01.75-.75zM12 19.75a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM4.575 5.636a.75.75 0 011.06 0l1.061 1.06a.75.75 0 01-1.06 1.061l-1.061-1.06a.75.75 0 010-1.061zm12.728 12.728a.75.75 0 011.061 0l1.06 1.061a.75.75 0 01-1.06 1.06l-1.06-1.06a.75.75 0 010-1.06zM3.25 12a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5H4a.75.75 0 01-.75-.75zm16.25-.75a.75.75 0 010 1.5h-1.5a.75.75 0 010-1.5h1.5zM5.636 19.425a.75.75 0 010-1.06l1.06-1.061a.75.75 0 111.061 1.06l-1.06 1.061a.75.75 0 01-1.061 0zm12.728-12.728a.75.75 0 010-1.061l1.061-1.06a.75.75 0 111.06 1.06l-1.06 1.061a.75.75 0 01-1.06 0z"/></svg>
  </button>
</template>

<script setup>
const isDark = ref(false)

onMounted(() => {
  isDark.value = localStorage.getItem('theme') === 'dark'
  if (isDark.value) document.documentElement.classList.add('dark')
})

function toggle() {
  document.documentElement.classList.toggle('dark')
  isDark.value = document.documentElement.classList.contains('dark')
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}
</script>
