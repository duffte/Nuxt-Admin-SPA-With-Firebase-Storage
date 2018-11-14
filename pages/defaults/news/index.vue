<template>
  <div>
    <BaseHero 
      title="News Defaults" 
      subtitle="careful"/>
    <section class="section has-background-light">
      <div class="container">
        <div class="columns">
          <div class="column is-6">
            <div v-if="newsData.length > 0">
              
              <div 
                v-for="(item, index) in newsData"                 
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
                <p class="content">
                  <b>Selection:</b>
                  {{ item.type }}
                </p>  
              </div>
            </div>  
            <hr>
            <button 
              class="button is-fullwidth" 
              @click="addNewsData">Add News Item</button>
            <hr>
            <b-field>
              <button 
                class="button is-fullwidth is-success" 
                @click="writeToFirestore">Update News Defaults</button>
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
      newsData: [],
      writeSuccessful: false
    }
  },
  methods: {
    async writeToFirestore() {
      var newsData = []
      const ref = fireDb.collection('defaults').doc('newsData')
      const document = {
        newsData: this.newsData
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
    addNewsData() {
      this.newsData.push({
        name: '',
        type: ''
      })
    }
  },
  async asyncData({ app, store }) {
    let news = await fireDb
      .collection('defaults')
      .doc('newsData')
      .get()

    if (news.data()) {
      return {
        newsData: news.data().newsData
      }
    }
  }
}
</script>

<style>
</style>
