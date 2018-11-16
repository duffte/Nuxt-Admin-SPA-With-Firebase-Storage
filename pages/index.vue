<template>
  <div>
    <BaseHero 
      title="Welcome To The Literally Universal Firestore Admin Panel" 
      subtitle="let's call it lufap"/>
    <section class="section content">
      <div class="container">
        
        <div class="columns">
          <div class="column">
            <h2>This is how it works</h2>
            <br>
            <h3 class="title">Literally universal</h3>
            <ul>
              <li>1) fetch all existing collections</li>
              <li>2) populate the menu with existing collections</li>
              <li>3) add new collections</li>
              <li>4) set up defaults for new documents</li>
              <li>5) add or edit documents based on the default settings for a document</li>
            </ul>
            <br>
            <i>additionally you can add component driven articles to every document by simply using the block system that is available to you on every document's page</i>
            <br>
            <h3 class="title">How to implement custom components</h3>
            <ul>
              <li>1) put your admin components into ~/components/custom/</li>
              <li>2) add a prop "adminIcon" and prop "adminName"</li>
              <li>3) have them automatically be set up for use</li>
            </ul>
            <br>
            <h3 class="title">Additional Features</h3>
            <ul>
              <li>Image uploader to firebase storage. Each image will be uploaded to: collectionName/documentId/filename.extension</li>
              <li>SimpleMde Markdown Editor</li>
              <li>drag and drop defaults to rearrange the order</li>
              <li>interlinkable!? you can link or add contents from another collections document or field</li>
            </ul>
            <br>
            <h3 class="title">To Do:</h3>
            <ul>
              <li>Firebase Auth Roles</li>
              <li>More Information On Lists</li>
              <li>Fix Vue Draggable To Allow Input Deletion</li>
              <li>Add Image Resize Cloud Function</li>
              <li>More Options To Fields (e.g. Select or Radio Buttons)</li>
              <li>if item not existant ( e.g. tag) add new right col</li>
            </ul>
            <br>
            <h3 class="title">Firestore Admin is build with</h3>
            <ul>
              <li>Vuejs/Nuxt</li>
              <li>vue-simplemde</li>
              <li>vue-draggable</li>
              <li>buefy</li>
            </ul>
          </div>
          <div class="column">
            <h2>The Approach</h2>
            <p>Build an universal admin panel for every imaginable project</p>
            <br>
            <p>
              When starting a new project i found firebase to be a nice solution to all my needs.
              I want to be able to stick to a service provider and not have to be picky with alternatives.
              So i build my entire project and future projects around firebase's infrastructure.
              You are not strictly bound to every aspect of it. you can edit the default components like image upload to use any service u like (e.g. cloudinary).
              <br>
              To be able to setup my database needs for the first firebase project, i had to build an admin panel.
              turns out that vuejs and nuxt would allow me to make it so that it could be as universal as it gets (within very short development time).
              Since i am running as the developer and will not be the only person using it, it is also meant to be non-dev-person-friendly.
              This is where firebase auth comes into play. 
            </p>
            
          </div>
        </div>
        
      </div>
    </section>
  </div>
</template>

<script>
export default {
  layout: 'admin'
}
</script>

<style>
</style>
