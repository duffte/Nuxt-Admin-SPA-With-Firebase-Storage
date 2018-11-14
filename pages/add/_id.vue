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
              v-for="(item, index) in data" 
              :label="item.name"
              :key="index">
              <!-- Text-->
              <b-field v-if="item.type == 'text'">
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

            </b-field>
            
            
            <button 
              :disabled="writeCarSuccessful"
              class="button" 
              @click="writeCarToFirestore">
              <span v-if="!writeCarSuccessful">Save Car</span>
              <span v-else>Successful!</span>
            </button>
          </div>
          <div class="column">
            <h2 class="title">if blocks show blocks</h2>
           
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
      tags: [],
      data: [],
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
      writeCarSuccessful: false
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
      const ref = fireDb
        .collection(this.params.id)
        .doc(this.car.carName.replace(/\s+/g, '-').toLowerCase())
      const document = {
        data: this.data
      }
      try {
        await ref.set(document)
      } catch (e) {
        // TODO: error handling
        console.error(e)
      }
      this.writeCarSuccessful = true
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
