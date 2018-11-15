<template>
  <div>
    <BaseHero 
      :title="$route.params.id +' Defaults'" 
      subtitle="DANGERZONE"/>
    <section class="section has-background-light">
      <div class="container">
        <div class="columns">
          <div class="column is-6">
            <div v-if="data.length > 0">
              
              <draggable 
                v-model="data" 
                @start="drag=true" 
                @end="drag=false">
                <!-- Data Loop -->
                <div 
                  v-for="(item, index) in data"                 
                  :key="index" 
                  class="box">  

                  <!-- Name -->  
                  <h2 class="title is-4">{{ item.name }} ({{ item.type }}) <button 
                    class="delete" 
                    @click="deleteBlock(index)"/></h2>        
                  <b-field>
                    <b-input v-model="item.name"/>                
                  </b-field> 
                  
                  <!-- Fields row 1 -->
                  <b-field>
                    <b-radio-button 
                      v-model="item.type"
                      native-value="text"
                      type="is-success">
                      <b-icon icon="text-short"/>
                      <span>Text</span>
                    </b-radio-button>

                    <b-radio-button 
                      v-model="item.type"
                      native-value="number"
                      type="is-success">
                      <b-icon icon="numeric"/>
                      <span>Number</span>
                    </b-radio-button>

                    <b-radio-button 
                      v-model="item.type"
                      native-value="textarea"
                      type="is-success">
                      <b-icon icon="text-subject"/>
                      <span>Textarea</span>
                    </b-radio-button>

                    <b-radio-button 
                      v-model="item.type"
                      native-value="tags"
                      type="is-success">
                      <b-icon icon="tag"/>
                      <span>Tags</span>
                    </b-radio-button>

                    <b-radio-button 
                      v-model="item.type"
                      native-value="date"
                      type="is-success">
                      <b-icon icon="calendar-range"/>
                      <span>Date</span>
                    </b-radio-button>

                    <b-radio-button 
                      v-model="item.type"
                      native-value="image"
                      type="is-success">
                      <b-icon icon="image"/>
                      <span>Image</span>
                    </b-radio-button>

                    <b-radio-button 
                      v-model="item.type"
                      native-value="radio"
                      type="is-success">
                      <b-icon icon="toggle-switch"/>
                      <span>Radio</span>
                    </b-radio-button>
                
                  </b-field>

                  <!-- Fields row 2 -->

                  <b-field>
                    <b-radio-button 
                      v-model="item.type"
                      native-value="car"
                      type="is-success">
                      <b-icon icon="car"/>
                      <span>Car</span>
                    </b-radio-button>

                    <b-radio-button 
                      v-model="item.type"
                      native-value="news"
                      type="is-success">
                      <b-icon icon="newspaper"/>
                      <span>News</span>
                    </b-radio-button>

                    <b-radio-button 
                      v-model="item.type"
                      native-value="brand"
                      type="is-success">
                      <b-icon icon="karate"/>
                      <span>Brand</span>
                    </b-radio-button>

                    <b-radio-button 
                      v-model="item.type"
                      native-value="topic"
                      type="is-success">
                      <b-icon icon="pound-box"/>
                      <span>Topic</span>
                    </b-radio-button>

                    <b-radio-button 
                      v-model="item.type"
                      native-value="feat"
                      type="is-success">
                      <b-icon icon="animation"/>
                      <span>Feat</span>
                    </b-radio-button>

                    <b-radio-button 
                      v-model="item.type"
                      native-value="chart"
                      type="is-success">
                      <b-icon icon="poll-box"/>
                      <span>Chart</span>
                    </b-radio-button>                  
                  </b-field>

                  <!-- Guide -->
                  <b-field 
                    label="Guide">
                    <b-input 
                      v-model="item.guide" 
                      placeholder="How to use the field"/>                
                  </b-field> 

            </div></draggable></div>  
            <hr>
            <button 
              class="button is-fullwidth" 
              @click="addData">Add Item</button>
            <hr>
            <b-field>
              <button 
                class="button is-fullwidth is-success" 
                @click="writeToFirestore">Update Defaults</button>
            </b-field>
          </div>
          <div class="column is-6 content">
            <h2>How to</h2>
            <p class="subtitle">Add or change the existing fields to manipulate the default datafields you see when adding new things to the website
            </p>
            <img src="~/assets/dragdrop.svg">
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { fireDb } from '~/plugins/firebase.js'
import { storage } from '~/plugins/firebase.js'

export default {
  layout: 'admin',
  data() {
    return {
      data: [],
      writeSuccessful: false
    }
  },
  methods: {
    deleteBlock: function(index) {
      this.data.splice(index, 1)
    },
    async writeToFirestore() {
      var data = []
      const ref = fireDb.collection('defaults').doc(this.$route.params.id)
      const document = {
        defaults: this.data
      }
      ref.get().then(thisDoc => {
        if (thisDoc.exists) {
          ref.update(document)
          this.writeSuccessful = true
        } else {
          ref.set(document)
          this.writeSuccessful = true
        }
      })
    },
    addData() {
      this.data.push({
        name: '',
        type: '',
        guide: ''
      })
    }
  },
  async asyncData({ params }) {
    let docs = await fireDb
      .collection('defaults')
      .doc(params.id)
      .get()

    if (docs.data()) {
      return {
        data: docs.data().defaults
      }
    } else {
      return {
        data: []
      }
    }
  }
}
</script>

<style>
</style>
