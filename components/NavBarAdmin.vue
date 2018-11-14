<template>
  <nav 
    id="nav" 
    class="navbar is-dark" 
    role="navigation" 
    aria-label="main navigation">
    <div class="navbar-brand">
      <router-link 
        to="/" 
        class="navbar-item">
        <img 
          src="~/assets/emil.svg"
          width="150" 
          height="50">
      </router-link>
      <a 
        :class="{ 'is-active': showNav }" 
        role="button" 
        class="navbar-burger burger" 
        @click="showNav = !showNav">
        <span aria-hidden="true"/>
        <span aria-hidden="true"/>
        <span aria-hidden="true"/>
      </a>
    </div>
    <div 
      id="navbarToggle" 
      :class="{ 'is-active': showNav }" 
      class="navbar-menu">
      <div class="navbar-start">
        <p class="navbar-item">
          <nuxt-link 
            to="/add/cars" 
            class="button is-info">Add Car</nuxt-link>
        </p>
        <p class="navbar-item">
          <nuxt-link 
            class="button is-info" 
            to="/add/news">Add News</nuxt-link>
        </p>
        <p class="navbar-item">
          <nuxt-link 
            class="button is-info" 
            to="/add/topic">Add Topic</nuxt-link>
        </p>        
        <p class="navbar-item">
          <nuxt-link 
            class="button is-info" 
            to="/add/brands">Add Brand</nuxt-link>
        </p>   
        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link">
            Edit Defaults
          </a>

          <div class="navbar-dropdown">
            <a class="navbar-item">
              <nuxt-link to="/defaults/news">News</nuxt-link>
            </a>
            <a class="navbar-item">
              <nuxt-link to="/defaults/cars">Cars</nuxt-link>
            </a>
            <a class="navbar-item">
              <nuxt-link to="/defaults/brands">Brands</nuxt-link>
            </a>
          </div>
        </div>
      </div>
    </div> 
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
  data() {
    return {
      showNav: false
    }
  }
}
</script>
