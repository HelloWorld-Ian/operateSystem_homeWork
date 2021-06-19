<template>
<div class="back">
<Header></Header>
<nav-menu style="float:left;margin-left:20px"></nav-menu>
<main style="float:left;margin-left:200px">
<router-view />
</main>
</div>
</template>

<script>
import Header from './components/header.vue'
import NavMenu from './components/NavMenu.vue'
export default {
  name: 'App',
  components:{
    Header,NavMenu
  }
}
</script>

