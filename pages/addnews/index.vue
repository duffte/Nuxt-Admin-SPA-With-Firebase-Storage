<template>
  <div>
    <BaseHero 
      title="Add News" 
      subtitle="based on defaults"/>
    <section class="section has-background-light">
      <div class="container">
        <div class="columns">
          <div class="column">
            <h2 class="title">
              Neuer Beitrag
            </h2>
            <label class="label">Kategorie</label>
            <div>
              <input 
                id="one" 
                v-model="category" 
                type="radio" 
                value="news">
              <label for="one">News</label>
              <br>
              <input 
                id="two" 
                v-model="category" 
                type="radio" 
                value="tech">
              <label for="two">Tech</label>
              <br>
            </div>
            <label class="label">Titel</label>
            <input 
              v-model="title" 
              class="input" 
              type="text" 
              placeholder="Titel">
            <label class="label">Untertitel</label>
            <input 
              v-model="subtitle" 
              class="input" 
              type="text" 
              placeholder="Untertitel">
            <label class="label">Excerpt</label>
            <input 
              v-model="excerpt" 
              class="input" 
              type="text" 
              placeholder="Excerpt">
            <label class="label">image</label>
            <input 
              v-model="image" 
              class="input" 
              type="text" 
              placeholder="image">
            <b-field label="Add some tags">
              <b-taginput
                v-model="tags"
                ellipsis
                icon="label"
                placeholder="Add a tag"/>
            </b-field>
            <p class="tags"><b>Tags:</b> {{ tags }}</p>
    
            
            
          </div>
          <div class="column">
            <h1 class="title">Blocks</h1>

            <ul class="">
              <li 
                v-for="(block, index) in blocks" 
                :key="index">
                <div v-if="block.type == 'text'" >
                  <h3 class="title is-5">Paragraph <button 
                    class="delete" 
                    @click="deleteBlock(index)">x</button></h3>
                  <label>Text</label>
                  <no-ssr>
                    <markdown-editor 
                      ref="markdownEditor" 
                      v-model="block.content"/>
                  </no-ssr>
                  <hr>
                </div>                    
                <div v-if="block.type == 'image'"> 
                  <h3 class="title is-5">Image <button 
                    class="delete" 
                    @click="deleteBlock(index)">x</button></h3>
                  <div>
                    <button
                      v-if="!uploadEnd && !uploading"
                      @click="selectFile">
                      Upload an image
                    </button>
                    <input
                      id="files"
                      ref="uploadInput"
                      :multiple="false"
                      type="file"
                      name="file"
                      accept="image/*"
                      @change="detectFiles($event)" >
                    <progress
                      v-if="uploading && !uploadEnd"
                      :value="progressUpload">
                      {{ progressUpload }}%
                    </progress>
                    <img
                      v-if="uploadEnd"
                      :src="downloadURL"
                      width="100%"
                    >
                    <div v-if="uploadEnd">
                      <button
                        class="button"
                        @click="deleteImage()"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <label>Source</label>
                  <input 
                    v-model="block.src" 
                    type="text" 
                    class="input">
                  <label>Caption</label>
                  <input 
                    v-model="block.caption" 
                    type="text" 
                    class="input">
                  <hr>
                </div> 
                <div v-if="block.type == 'car'">
                  <h3 class="title is-5">Car <button 
                    class="delete" 
                    @click="deleteBlock(index)">x</button></h3>     
                  <p class="content"><b>Selected:</b> {{ block.selected }}</p>
                  <b-field label="Find a car">
                    <b-autocomplete
                      v-model="block.name"
                      :keep-first="keepFirst"
                      :open-on-focus="openOnFocus"
                      :data="filteredDataObj"
                      placeholder="e.g. BMW"
                      field="carName"
                      @select="option => block.selected = option"/>
                  </b-field>        
                  <hr>
                </div>                   
              </li>
            </ul>
            
            <button @click="addBlock()">Add new Text</button>
            <button @click="addImage()">Add new Image</button>
            <button @click="addCar()">Add new Car</button>     

            <button 
              :disabled="writeSuccessful" 
              @click="writeToFirestore">
              <span v-if="!writeSuccessful">Save News</span>
              <span v-else>Successful!</span>
            </button>
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
      idcounter: 0,
      blocks: [],
      writeSuccessful: false,
      title: '',
      subtitle: '',
      excerpt: '',
      category: 'news',
      image: '',
      tags: [],
      cars: [],
      keepFirst: false,
      openOnFocus: true,
      name: '',
      selected: null,
      //upload image
      oldImgUrl: '',
      progressUpload: 0,
      fileName: '',
      uploadTask: '',
      uploading: false,
      uploadEnd: false,
      downloadURL: ''
    }
  },
  layout: 'admin',
  computed: {
    filteredDataObj() {
      return this.cars.filter(option => {
        return (
          option.carName
            .toString()
            .toLowerCase()
            .indexOf(this.name.toLowerCase()) >= 0
        )
      })
    }
  },
  watch: {
    uploadTask: function() {
      this.uploadTask.on(
        'state_changed',
        sp => {
          this.progressUpload = Math.floor(
            (sp.bytesTransferred / sp.totalBytes) * 100
          )
        },
        null,
        () => {
          this.uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            this.uploadEnd = true
            this.downloadURL = downloadURL
          })
        }
      )
    }
  },
  methods: {
    setImageSource: function(index) {
      this.blocks[index].src = downloadURL
    },
    deleteBlock: function(index) {
      this.blocks.splice(index, 1)
    },
    addBlock() {
      this.blocks.push({
        content: 'new block',
        type: 'text',
        id: this.idcounter++
      })
    },
    addImage() {
      this.blocks.push({ content: 'new block', type: 'image' })
    },
    addCar() {
      this.blocks.push({ name: '', selected: {}, type: 'car' })
    },
    async writeToFirestore() {
      const ref = fireDb
        .collection(this.category)
        .doc(this.title.replace(/\s+/g, '-').toLowerCase())
      const document = {
        newsBlocks: this.blocks,
        newsDate: new Date(),
        newsSubtitle: this.subtitle,
        newsTitle: this.title.trim(),
        newsId: this.title.replace(/\s+/g, '-').toLowerCase(),
        newsTags: this.tags,
        newsImage: this.image,
        newsExcerpt: this.excerpt
      }
      try {
        await ref.set(document)
      } catch (e) {
        // TODO: error handling
        console.error(e)
      }
      this.writeSuccessful = true
    },
    //upload image
    selectFile() {
      this.$refs.uploadInput.click()
    },
    detectFiles(e) {
      let fileList = e.target.files || e.dataTransfer.files
      Array.from(Array(fileList.length).keys()).map(x => {
        this.upload(fileList[x])
      })
    },
    upload(file) {
      this.fileName = file.name
      this.uploading = true
      this.uploadTask = storage.ref('news/' + file.name).put(file)
    },
    deleteImage() {
      if (this.oldImgUrl === '') {
        this.deleteImgOnFirebase()
      } else {
        this.deleteImgOnUpdate()
      }
    },
    setCoverImgOnUpdate() {
      this.uploadEnd = true
      this.downloadURL = this.oldImgUrl
    },
    deleteImgOnFirebase() {
      storage
        .ref('news/' + this.fileName)
        .delete()
        .then(() => {
          this.uploading = false
          this.uploadEnd = false
          this.downloadURL = ''
          console.log('deleted')
        })
        .catch(error => {
          console.error(`file delete error occured: ${error}`)
        })
    },
    deleteImgOnUpdate() {
      this.uploading = false
      this.uploadEnd = false
      this.downloadURL = ''
    }
  },
  async asyncData({ app, store }) {
    let cars = []
    try {
      await fireDb
        .collection('cars')
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            cars.push(doc.data())
          })
        })
      return { cars: cars }
    } catch (error) {
      console.log('Error getting document:', error)
    }
  }
}
</script>
