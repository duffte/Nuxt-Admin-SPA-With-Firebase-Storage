<template>
  <div>
    <BaseHero 
      :title="'Add New '+ $route.params.id" 
      subtitle="based on defaults"/>
    <section class="section has-background-light">
      <div class="container">           
        <div class="columns">
          <div class="column">
            <h2 class="title">
              Add {{ $route.params.id }}
            </h2>
            <b-field
              label="Permalink/id">
              <b-input 
                v-model="id" 
                type="text"
                placeholder="e.g. this-is-a-permalink"/>
            </b-field>
            <b-field 
              v-for="(item, index) in data"
              :label="item.name" 
              :key="index"
            >
              <!-- Text-->
              <b-field 
                v-if="item.type == 'text'" 
              >
                <b-input 
                  v-model="item.content" 
                />                
              </b-field>
              <!-- Textarea-->
              <b-field v-if="item.type == 'number'">
                <b-input 
                  v-model="item.content" 
                  type="number"/>
              </b-field>
              <!-- Textarea-->
              <b-field v-if="item.type == 'textarea'">
                <b-input 
                  v-model="item.content"  
                  type="textarea"/>
              </b-field>
              <!-- Tags-->
              <b-field v-if="item.type == 'tags'">
                <b-taginput
                  v-model="tags"
                  ellipsis
                  icon="label"
                  placeholder="Add a tag"/>
              </b-field>
              <!-- Date-->
              <b-field v-if="item.type == 'date'">
                <b-datepicker 
                  v-model="date"
                  :first-day-of-week="1"
                  placeholder="Click to select...">

                  <button 
                    class="button is-primary"
                    @click="date = new Date()">
                    <b-icon icon="calendar-today"/>
                    <span>Today</span>
                  </button>

                  <button 
                    class="button is-danger"
                    @click="date = null">
                    <b-icon icon="close"/>
                    <span>Clear</span>
                  </button>
                </b-datepicker>
              </b-field>
              <!-- Image-->
              <div v-if="item.type == 'image'">
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
                <b-field label="Source URL">
                  <b-input 
                    v-model="item.content"  
                    type="text"/>
                </b-field>
              </div>

              <!-- Radio -->
              <b-field v-if="item.type == 'radio'">
                <b-switch 
                  v-model="item.content"
                  true-value="Yes"
                  false-value="No">
                  {{ item.content }}
                </b-switch>
              </b-field>

            </b-field>
            
            
            <button 
              :disabled="writeCarSuccessful"
              class="button is-fullwidth" 
              @click="writeCarToFirestore">
              <span v-if="!writeCarSuccessful">Store</span>
              <span v-else>Successful!</span>
            </button>
          </div>
          <div class="column">
            <h1 class="title">Blocks</h1>

            <ul class="">
              <li 
                v-for="(block, index) in blocks" 
                :key="index"
                class="box">
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
                      :data="filteredDataObj"
                      :keep-first="keepFirst"
                      :open-on-focus="openOnFocus"
                      placeholder="e.g. BMW"
                      field="carName"
                      @select="option => block.selected = option"/>
                  </b-field>        
                  <hr>
                </div>                   
              </li>
            </ul>
            <hr>
            <b-field grouped>
              <button 
                class="button" 
                @click="addBlock()">Add new Text</button>
              <button 
                class="button" 
                @click="addImage()">Add new Image</button>
              <button 
                class="button" 
                @click="addCar()">Add new Car</button>  
            </b-field>
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
      id: '',
      tags: [],
      data: [],
      cars: [],
      blocks: [],
      name: '',
      filteredTags: [],
      date: new Date(),
      //upload image
      oldImgUrl: '',
      progressUpload: 0,
      fileName: '',
      uploadTask: '',
      uploading: false,
      uploadEnd: false,
      downloadURL: '',
      //cars
      writeCarSuccessful: false,
      //buefy
      keepFirst: false,
      openOnFocus: true
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
    deleteBlock: function(index) {
      this.blocks.splice(index, 1)
    },
    addBlock() {
      this.blocks.push({
        content: '',
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
    setImageSource: function(index) {
      this.blocks[index].src = downloadURL
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
    },
    async writeCarToFirestore() {
      const ref = fireDb.collection(this.$route.params.id).doc(this.id)
      const document = {
        data: this.data,
        blocks: this.blocks
      }
      try {
        await ref.set(document)
      } catch (e) {
        // TODO: error handling
        console.error(e)
      }
      this.writeSuccessful = true
    }
  },
  async asyncData({ params }) {
    let docs = await fireDb
      .collection('defaults')
      .doc(params.id)
      .get()

    let carCollection = []
    let cars = await fireDb
      .collection('cars')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          carCollection.push(doc.data())
        })
      })

    if (docs.data()) {
      return {
        data: docs.data().defaults,
        cars: carCollection
      }
    } else {
      return {
        data: [],
        cars: carCollection
      }
    }
  }
}
</script>
