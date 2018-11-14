<template>
  <section class="hero is-medium">
    <div class="container">
      <div class="hero-body">
        <h1 class="title">
          {{ title }}
        </h1>
        <h2 class="subtitle">
          {{ subtitle }}
        </h2>
        <img 
          v-if="image" 
          :src="image" 
          class="hero-image">
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'BaseHero',
  props: {
    title: {
      type: String,
      default: 'Title'
    },
    subtitle: {
      type: String,
      default: 'Subtitle'
    },
    image: {
      type: String,
      default: null
    }
  }
}
</script>

<style>
</style>
