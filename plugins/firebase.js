import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'

if (!firebase.apps.length) {
  const config = {
    apiKey: 'AIzaSyCAUu1ZsJbcFVsPOjb1iTrj6O_bLIhEMbQ',
    authDomain: 'emil-6e292.firebaseapp.com',
    databaseURL: 'https://emil-6e292.firebaseio.com',
    projectId: 'emil-6e292',
    storageBucket: 'emil-6e292.appspot.com',
    messagingSenderId: '61545904734'
  }
  firebase.initializeApp(config)
  firebase.firestore().settings({ timestampsInSnapshots: true })
}
const fireDb = firebase.firestore()
const storage = firebase.storage()

export { storage, fireDb }
