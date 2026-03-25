// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  runtimeConfig: {
    adminPassword: (globalThis as any)?.process?.env?.ADMIN_PASSWORD || 'sui',
  },

  app: {
    head: {
      script: [
        {
          innerHTML: `if(localStorage.getItem('theme')==='dark')document.documentElement.classList.add('dark')`,
          tagPosition: 'head',
        },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Geist+Mono:wght@300;400&display=swap',
        },
      ],
    },
  },

  modules: ['@nuxt/content'],

  css: ['~/assets/css/common.css'],
})
