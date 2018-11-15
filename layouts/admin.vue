<template>
  <div>
    <NavBarAdmin/>
    <transition 
      name="fade" 
      mode="out-in">
      <nuxt/>
    </transition>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  -webkit-transition: opacity 0.3s, -webkit-transform 0.3s;
  transition: opacity 0.3s, -webkit-transform 0.3s;
  transition: opacity 0.3s, transform 0.3s;
  transition: opacity 0.3s, transform 0.3s, -webkit-transform 0.3s;
}
.fade-enter {
  opacity: 100;
  -webkit-transform: translateY(-20px);
  transform: translateY(-20px);
}
.fade-leave-to {
  opacity: 100;
  -webkit-transform: translateY(20px);
  transform: translateY(20px);
}
</style>
