<template>
  <nav 
    id="nav" 
    class="navbar" 
    role="navigation" 
    aria-label="main navigation">
    <div class="navbar-brand">
      <router-link 
        to="/admin" 
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
          <nuxt-link to="/admin/addcar">Add Car</nuxt-link>
        </p>
        <p class="navbar-item">
          <nuxt-link to="/admin/addnews">Add News</nuxt-link>
        </p>     
        <b-dropdown position="is-bottom-left">
          <a 
            slot="trigger" 
            class="navbar-item">
            <span>Configure Defaults</span>
            <b-icon icon="menu-down"/>
          </a>
          <b-dropdown-item value="settings">
            <nuxt-link to="/admin/defaults/news">News</nuxt-link>
          </b-dropdown-item>
          <b-dropdown-item value="settings">
            <nuxt-link to="/admin/defaults/cars">Cars</nuxt-link>
          </b-dropdown-item>
          <b-dropdown-item value="settings">
            <nuxt-link to="/admin/defaults/brands">Brands</nuxt-link>
          </b-dropdown-item>
        </b-dropdown>
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
