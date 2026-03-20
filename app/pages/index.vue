<template>
  <div class="container">
    <div class="center">
      <div class="logo-wrap">
        <SiteLogo />
      </div>

      <span class="domain">saadso.com</span>

      <h1 class="headline">Some<br>thing<br><em>new.</em></h1>

      <p class="sub">Working on it.<br>Worth the wait.</p>
    </div>

    <SiteFooter />
  </div>
</template>

<script setup>
useHead({ title: 'saadso.com' })
</script>

<style scoped>
.container {
  min-height: calc(100vh - 60px);
  display: grid;
  grid-template-rows: 1fr auto;
  padding: clamp(2.5rem, 6vw, 5rem);
  position: relative;
  z-index: 1;
}
.center {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 2.4rem;
}

/* ── Logo ── */
.logo-wrap {
  opacity: 0;
  animation: fadeUp 1s ease forwards 0.1s;
}
.logo-wrap :deep(svg) {
  width: clamp(52px, 9vw, 82px);
  height: auto;
  color: var(--ink);
  transition: color 0.3s ease;
}
.logo-wrap:hover :deep(svg) {
  color: var(--lilac);
}

/* ── Eyebrow ── */
.domain {
  font-size: clamp(0.58rem, 0.95vw, 0.68rem);
  letter-spacing: 0.3em;
  color: var(--muted);
  text-transform: uppercase;
  opacity: 0;
  animation: fadeUp 0.8s ease forwards 0.45s;
}

/* ── Headline ── */
.headline {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 300;
  font-size: clamp(3.8rem, 11vw, 8.5rem);
  line-height: 0.91;
  letter-spacing: -0.025em;
  opacity: 0;
  animation: fadeUp 1s ease forwards 0.75s;
}
.headline em {
  font-style: italic;
  color: var(--lilac);
}

/* ── Sub ── */
.sub {
  font-size: clamp(0.58rem, 0.95vw, 0.68rem);
  color: var(--muted);
  letter-spacing: 0.14em;
  line-height: 1.95;
  opacity: 0;
  animation: fadeUp 0.8s ease forwards 1.05s;
}

/* ── Mobile ── */
@media (max-width: 480px) {
  .headline { line-height: 0.95; }
}
</style>
