<template>
  <div>
    <BaseHero 
      title="Brand Defaults" 
      subtitle="careful"/>
    <section class="section has-background-light">
      <div class="container">
        <div class="columns">
          <div class="column is-6">
            <div v-if="brandsData.length > 0">
              
              <div 
                v-for="(item, index) in brandsData"                 
                :key="index" 
                class="box">            
                <b-field 
                  :label="item.name">
                  <b-input v-model="item.name"/>                
                </b-field> 
                  
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

                </b-field>
                <div class="level">
                  <div class="level-left">
                    <b>Selection:</b>
                    {{ item.type }}
                  </div>
                  <div class="level-left">
                    <button 
                      class="button is-danger" 
                      @click="deleteBlock">Delete</button>
                  </div>
                </div>
              </div>
            </div>  
            <hr>
            <button 
              class="button is-fullwidth" 
              @click="addBrandsData">Add Brand Item</button>
            <hr>
            <b-field>
              <button 
                class="button is-fullwidth is-success" 
                @click="writeToFirestore">Update Brand Defaults</button>
            </b-field>
          </div>
          <div class="column is-6">
            Add or change the existing fields to manipulate the default datafields you see when adding new things to the website
          </div>
        </div>
    </div></section>
  </div>
</template>

<script>
import { fireDb } from '~/plugins/firebase.js'
import { storage } from '~/plugins/firebase.js'

export default {
  layout: 'admin',
  data() {
    return {
      brandsData: [],
      writeSuccessful: false
    }
  },
  methods: {
    deleteBlock: function(index) {
      this.brandsData.splice(index, 1)
    },
    async writeToFirestore() {
      var brandsData = []
      const ref = fireDb.collection('defaults').doc('brandsData')
      const document = {
        brandsData: this.brandsData
      }
      ref.get().then(function(thisDoc) {
        if (thisDoc.exists) {
          ref.update(document)
          this.writeSuccessful = true
        } else {
          ref.set(document)
          this.writeSuccessful = true
        }
      })
    },
    addBrandsData() {
      this.brandsData.push({
        name: '',
        type: ''
      })
    }
  },
  async asyncData({ app, store }) {
    let brands = await fireDb
      .collection('defaults')
      .doc('brandsData')
      .get()

    if (brands.data()) {
      return {
        brandsData: brands.data().brandsData
      }
    }
  }
}
</script>

<style>
</style>
