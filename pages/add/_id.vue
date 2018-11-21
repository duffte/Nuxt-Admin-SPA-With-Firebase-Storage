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
                v-model="document.id" 
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
                  v-model="document[item.name]" 
                />                
              </b-field>
              <!-- Textarea-->
              <b-field v-if="item.type == 'number'">
                <b-input 
                  v-model="document[item.name]" 
                  type="number"/>
              </b-field>
              <!-- Textarea-->
              <b-field v-if="item.type == 'textarea'">
                <b-input 
                  v-model="document[item.name]"  
                  type="textarea"/>
              </b-field>
              <!-- Topics -->
              <b-field v-if="item.type == 'array'">
                <b-taginput
                  v-model="document[item.name]"
                  ellipsis
                  icon="label"
                  placeholder="Add an option"/>
              </b-field>
              <!-- Date-->
              <b-field v-if="item.type == 'date'">
                <b-datepicker 
                  v-model="document[item.name]"
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
                    v-model="document[item.name]"  
                    type="text"/>
                </b-field>
              </div>

              <!-- Radio -->
              <b-field v-if="item.type == 'radio'">
                <b-switch 
                  :value="false"
                  v-model="document[item.name]"
                  type="is-info"
                  true-value="Yes"
                  false-value="No">
                  {{ document[item.name] }}
                </b-switch>
              </b-field>

              <!-- Topics -->
              <b-field v-if="item.type == 'topic'">
                <b-field>
                  <b-autocomplete
                    v-model="selected[item.name]"
                    :data="topics"
                    open-on-focus="true"
                    placeholder="e.g. Wettbewerb"
                    field="topicName"
                    @select="option => document[item.name] = option"/>
                </b-field>
              </b-field>


              <!-- Author -->
              <b-field v-if="item.type == 'author'">
                <b-field>
                  <b-autocomplete
                    v-model="selected[item.name]"
                    :data="authors"
                    open-on-focus="true"
                    placeholder="e.g. Anne"
                    field="authorName"
                    @select="option => document[item.name] = option"/>
                </b-field>
              </b-field>

              <!-- Brand -->
              <b-field v-if="item.type == 'brand'">
                <b-field>
                  <b-autocomplete
                    v-model="selected[item.name]"
                    :data="brands"
                    open-on-focus="true"
                    placeholder="e.g. BMW"
                    field="brandName"
                    @select="option => document[item.name] = option"/>
                </b-field>
              </b-field>              

            </b-field>   

            <!-- CAR SPECS -->
            
            <br>
            <h2 class="title">Specifications</h2>

            <ul v-if="$route.params.id == 'cars'">
              <li 
                v-for="spec in specifications" 
                :key="spec.id">

                <b-field :label="spec.specName + ' (' + spec.specAbbr + ')'">
                  <b-input 
                    v-model="spec.specValue"  
                    type="number"/>
              </b-field></li>
            </ul>         
            <br>
            <button 
              :disabled="writeCarSuccessful"
              class="button is-success is-fullwidth" 
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
      specs: {},
      specifications: {},
      newsTags: [],
      document: {},
      id: '',
      tags: [],
      brands: [],
      data: [],
      cars: [],
      blocks: [],
      name: '',
      filteredTags: [],
      date: new Date(),
      selected: [],
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
    filteredAuthors() {
      return this.authors.filter(option => {
        return (
          option.authorName
            .toString()
            .toLowerCase()
            .indexOf(this.name.toLowerCase()) >= 0
        )
      })
    },
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
    getFilteredAuthors(text) {
      var authors = this.authors.filter(option => {
        return (
          option
            .toString()
            .toLowerCase()
            .indexOf(text.toLowerCase()) >= 0
        )
      })
    },
    getFilteredTopics(text) {
      var topics = this.topics.filter(option => {
        return (
          option
            .toString()
            .toLowerCase()
            .indexOf(text.toLowerCase()) >= 0
        )
      })
    },
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
      var baseDir = this.$route.params.id
      var extDir = this.document.id
      this.uploadTask = storage
        .ref(`${baseDir}/${extDir}/${file.name}`)
        .put(file)
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
      var baseDir = this.$route.params.id
      var extDir = this.document.id
      storage
        .ref(`${baseDir}/${extDir}/${this.fileName}`)
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
      if (this.blocks.length > 0) {
        var timeToRead = await Math.round(
          JSON.stringify(this.blocks).split(' ').length / 200
        )
        this.document.timeToRead = timeToRead
      }
      this.document.specs = this.specifications

      const ref = fireDb.collection(this.$route.params.id).doc(this.document.id)

      const document = {
        data: this.document,
        blocks: this.blocks,
        specs: this.specifications
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
    let def = await fireDb
      .collection('defaults')
      .doc(params.id)
      .get()

    let carCollection = []
    let cars = await fireDb
      .collection('cars')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          carCollection.push(doc.data().data)
        })
      })

    let topicCollection = []
    let topics = await fireDb
      .collection('topics')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          topicCollection.push(doc.data().data)
        })
      })

    let authorCollection = []
    let authors = await fireDb
      .collection('authors')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          authorCollection.push(doc.data().data)
        })
      })

    let brandCollection = []
    let brands = await fireDb
      .collection('brands')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          brandCollection.push(doc.data().data)
        })
      })

    let specCollection = []
    let specs = await fireDb
      .collection('specifications')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          specCollection.push(doc.data().data)
        })
      })

    if (def.data()) {
      return {
        data: def.data().defaults,
        cars: carCollection,
        topics: topicCollection,
        authors: authorCollection,
        brands: brandCollection,
        specifications: specCollection
      }
    } else {
      return {
        data: [],
        cars: carCollection,
        topics: topicCollection,
        authors: authorCollection,
        brands: brandCollection,
        specifications: specCollection
      }
    }
  }
}
</script>
