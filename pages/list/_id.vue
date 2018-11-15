<template>
  <div>
    <BaseHero 
      :title="'Edit '+ $route.params.id" 
      subtitle="and be happy"/>
    
    <section class="section has-background-light">
      <div class="container" >           
        <div class="columns">
          <div class="column">
            <b-table 
              :data="data" 
              :columns="columns"
              :selected.sync="selected"   
              :paginated="isPaginated"
              :per-page="perPage"
              :current-page.sync="currentPage"
              :pagination-simple="isPaginationSimple"
              :default-sort-direction="defaultSortDirection"
              default-sort="id"            
              focusable/>
            <button 
              class="button" 
              @click="$router.push({ path: `/edit/${selected.id}` })">Edit Document</button>
            <button 
              class="button is-danger" 
              @click="deleteDocument(docid, selected.id)">deleteDocument</button>            
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
  data() {
    return {
      docid: this.$route.params.id,
      selected: {},
      data: [],
      columns: [
        {
          field: 'id',
          label: 'ID',
          width: '40',
          numeric: false
        }
      ],
      isPaginated: true,
      isPaginationSimple: false,
      defaultSortDirection: 'asc',
      currentPage: 1,
      perPage: 3
    }
  },
  methods: {
    deleteDocument: (docid, selection) => {
      fireDb
        .collection(docid.toString())
        .doc(selection)
        .delete()
        .then(() => {
          console.log('Document successfully deleted!')
        })
        .catch(function(error) {
          console.error('Error removing document: ', error)
        })
    }
  },
  layout: 'admin',
  async asyncData({ params }) {
    let docCollection = []
    let docs = await fireDb
      .collection(params.id)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          docCollection.push(doc.data())
        })
      })
    return {
      data: docCollection
    }
  }
}
</script>
