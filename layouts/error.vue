<template>
  <section class="hero is-large">
    <div class="container has-text-centered">
      <div class="hero-body">            
        <h1 
          v-if="error.statusCode === 404" 
          class="title">404</h1>
        <h1 
          v-else 
          class="title">:(</h1>
        <nuxt-link 
          to="/" 
          class="subtitle">Start</nuxt-link>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  layout: 'default', // you can set a custom layout for the error page,
  head() {
    return {
      title: 'Error 404',
      meta: [
        // hid is used as unique identifier. Do not use `vmid` for it as it will not work
        {
          hid: '404-error',
          name: 'description',
          content: '404 Error - Not Found'
        }
      ]
    }
  }
}
</script>
