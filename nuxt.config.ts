export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    'shadcn-nuxt',
    '@pinia/nuxt',
    'nuxt-icon',
  ],
  googleFonts: {
    families: {
      'Rubik': true,
    }
  },
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },
  pinia: {
    storesDirs: ['./stores/**'],
  },
})
