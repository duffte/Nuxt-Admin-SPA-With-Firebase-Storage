<template>
  <div>
    <BaseHero 
      title="Add a car" 
      subtitle="based on defaults"/>
    <section class="section">
      <div class="container">           
        <div class="columns">
          <div class="column">
            <h2 class="title">
              Neues Auto
            </h2>
            <b-field label="Name">
              <b-input v-model="car.carName"/>
            </b-field>
            <b-field label="Brand">
              <b-input v-model="car.carBrand"/>
            </b-field>
            <b-field label="Model">
              <b-input v-model="car.carModel"/>
            </b-field>
            <b-field label="Year">
              <b-input v-model="car.carYear"/>
            </b-field>
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
            <b-field label="Image Source">
              <b-input v-model="car.carImage"/>
            </b-field>
            
            <button 
              :disabled="writeCarSuccessful" 
              @click="writeCarToFirestore">
              <span v-if="!writeCarSuccessful">Save Car</span>
              <span v-else>Successful!</span>
            </button>
          </div>
          <div class="column">
            <h2 class="title">Specs</h2>
            <b-field 
              v-for="(spec, index) in specs" 
              :key="index"
              :label="spec.name">
              <b-input v-model="spec.value"/>
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
      specs: [
        { name: 'he', id: 1 },
        { name: 'hehe', id: 2 },
        { name: 'hehehe', id: 3 }
      ],
      newSpecs: [],
      tags: [],
      cars: [],
      name: '',
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
      car: {
        carName: '',
        carModel: '',
        carBrand: '',
        carYear: '',
        carImage: ''
      }
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
        .collection('cars')
        .doc(this.car.carName.replace(/\s+/g, '-').toLowerCase())
      const document = {
        carName: this.car.carName.trim(),
        carModel: this.car.carModel.trim(),
        carBrand: this.car.carBrand.trim(),
        id: this.car.carName.replace(/\s+/g, '-').toLowerCase(),
        carImage: this.car.carImage.trim(),
        carYear: this.car.carYear.trim(),
        specs: this.specs
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
