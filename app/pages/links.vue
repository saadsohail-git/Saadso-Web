<template>
  <div class="page-center">
    <h1>Cool<br><em>links.</em></h1>
    <p>Cool links will be added here.</p>
  </div>
</template>

<script setup>
useHead({ title: 'Links — saadso.com' })
</script>

<style scoped>
.page-center {
  min-height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  padding: clamp(2.5rem, 6vw, 5rem);
  text-align: center;
  gap: 1.2rem;
}
.page-center h1 {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 300;
  font-size: clamp(2.5rem, 7vw, 5rem);
  line-height: 1;
  letter-spacing: -0.02em;
  opacity: 0;
  animation: fadeUp 1s ease forwards 0.3s;
}
.page-center h1 em {
  font-style: italic;
  color: var(--lilac);
}
.page-center p {
  font-size: clamp(0.58rem, 0.95vw, 0.68rem);
  color: var(--muted);
  letter-spacing: 0.14em;
  opacity: 0;
  animation: fadeUp 0.8s ease forwards 0.6s;
}
</style>
