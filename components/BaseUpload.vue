<template>
  <b-field>
    <b-input 
      v-model="thumb.url" 
      type="file" 
      class="form-control" 
      accept="image/*" 
      @change="upload($event.target.files)" />
  </b-field>
</template>

<script>
export default {
  data: function() {
    return {
      cloudinary: {
        uploadPreset: '<UPLOAD-PRESET>',
        apiKey: '<API-KEY>',
        cloudName: '<CLOUD-NAME>'
      },
      thumb: {
        url: ''
      },
      thumbs: []
    }
  },
  computed: {
    clUrl: function() {
      return `https://api.cloudinary.com/v1_1/${
        this.cloudinary.cloudName
      }/upload`
    }
  },
  methods: {
    upload: function(file) {
      const formData = new FormData()
      formData.append('file', file[0])
      formData.append('upload_preset', this.cloudinary.uploadPreset)
      formData.append('tags', 'gs-vue,gs-vue-uploaded')
      // For debug purpose only
      // Inspects the content of formData
      for (var pair of formData.entries()) {
        console.log(pair[0] + ', ' + pair[1])
      }
      axios.post(this.clUrl, formData).then(res => {
        this.thumbs.unshift({
          url: res.data.secure_url
        })
      })
    }
  }
}
</script>

<style>
</style>
