<template>
  <div>
    <BaseHero 
      :title="'Edit '+ $route.params.id" 
      subtitle="and be happy"/>
    
    <section class="section has-background-light">
      <div class="container" >           
        <div class="columns">
          <div class="column"/>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { fireDb } from '~/plugins/firebase.js'
import { storage } from '~/plugins/firebase.js'

export default {
  data() {
    return {
      docid: this.$route.params.id,
      data: []
    }
  },
  methods: {},
  layout: 'admin'
}
</script>
