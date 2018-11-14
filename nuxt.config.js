const pkg = require('./package')

module.exports = {
  mode: 'spa',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Admin' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#167df0' },

  /*
  ** Global CSS
  */
  css: ['simplemde/dist/simplemde.min.css'],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/global.js',
    '~/plugins/firebase.js',
    { src: '~plugins/nuxt-simplemde-plugin.js', ssr: false }
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    ,
    // Doc: https://buefy.github.io/#/documentation
    'nuxt-buefy',

    '@nuxtjs/markdownit'
  ],

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
