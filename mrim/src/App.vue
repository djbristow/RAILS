<template>
<div id="app">
  <nav class="navbar is-fixed-top has-shadow is-spaced">
    <div class="navbar-brand">
      <a class="navbar-item" href="http://kjcrr.org" target="_blank"><strong>KJ&C RR</strong>
    </a>
      <div class="navbar-burger burger" @click="toggleMenu" :class="{'is-active': navIsActive}" data-target="mainNav">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
    <div id="mainNav" class="navbar-menu" :class="{'is-active': navIsActive}">
      <div class="navbar-start">
        <a class="navbar-item" href="/">Home</a>
        <div class="navbar-item has-dropdown is-hoverable">
          <strong>Rollingstock</strong>
          <div id="moreDropdown" class="navbar-dropdown">
            <a class="navbar-item" href="/Rslist">List</a>
            <hr class="navbar-divider">
            <a class="navbar-item" href="/RS/new">New</a>
          </div>
        </div>
        &nbsp;&nbsp;&nbsp;
        <div class="navbar-item has-dropdown is-hoverable">
          <strong>Images</strong>
          <div id="moreDropdown" class="navbar-dropdown">
            <a class="navbar-item" href="/Imglist">List</a>
            <hr class="navbar-divider">
            <a class="navbar-item" href="/Img/new">New</a>
          </div>
        </div>
        &nbsp;&nbsp;&nbsp;
        <div class="navbar-item has-dropdown is-hoverable">
          <strong>AAR Codes</strong>
          <div id="moreDropdown" class="navbar-dropdown">
            <a class="navbar-item" href="/Aarlist">List</a>
            <hr class="navbar-divider">
            <a class="navbar-item" href="/Aar/new">New</a>
          </div>
        </div>
        &nbsp;&nbsp;&nbsp;
        <div class="navbar-item has-dropdown is-hoverable">
          <strong>Companies</strong>
          <div id="moreDropdown" class="navbar-dropdown">
            <a class="navbar-item" href="/Colist">List</a>
            <hr class="navbar-divider">
            <a class="navbar-item" href="/Co/new">New</a>
          </div>
        </div>
      </div>
    </div>
  </nav>
  <section>
    <br><br><br><br><br>
    <div class="center">
      <h1 class="title is-3">Model Railroad Inventory Manager</h1>
    </div>
    <router-view/>
  </section>
</div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      navIsActive: false
    }
  },
  methods: {
    toggleMenu: function() {
      this.navIsActive = !this.navIsActive
    }
  }
}
</script>

<style scoped>
img {
  padding-left: 25px;
  padding-right: 20px;
}

.center {
  text-align: center;
}
</style>
