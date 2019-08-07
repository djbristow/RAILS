<template>
  <div id="app">
    <nav class="navbar is-fixed-top has-shadow is-spaced">
      <div class="navbar-brand">
        <a
          class="navbar-item"
          href="http://kjcrr.org"
          target="_blank"
        >
          <strong>KJ&C RR</strong>
        </a>
        <div
          class="navbar-burger burger"
          :class="{'is-active': navIsActive}"
          data-target="mainNav"
          @click="toggleMenu"
        >
          <span />
          <span />
          <span />
        </div>
      </div>
      <div
        id="mainNav"
        class="navbar-menu"
        :class="{'is-active': navIsActive}"
      >
        <div class="navbar-start">
          <div class="navbar-item">
            <router-link to="/">
              Home
            </router-link>
          </div>
          <div class="navbar-item">
            <router-link to="/Admix">
              Admin
            </router-link>
          </div>
          <div class="navbar-item has-dropdown is-hoverable">
            <strong>Model Company</strong>
            <div
              id="moreDropdown"
              class="navbar-dropdown"
            >
              <div class="navbar-item">
                <router-link to="/Mcolist">
                  List
                </router-link>
              </div>
              <hr class="navbar-divider">
              <div class="navbar-item">
                <router-link to="/Mco/new">
                  New
                </router-link>
              </div>
            </div>
          </div>&nbsp;&nbsp;&nbsp;
          <div class="navbar-item has-dropdown is-hoverable">
            <strong>Projects</strong>
            <div
              id="moreDropdown"
              class="navbar-dropdown"
            >
              <div class="navbar-item">
                <router-link to="/Projlist">
                  List
                </router-link>
              </div>
              <hr class="navbar-divider">
              <div class="navbar-item">
                <router-link to="/Proj/new">
                  New
                </router-link>
              </div>
            </div>
          </div>&nbsp;&nbsp;&nbsp;
          <div class="navbar-item has-dropdown is-hoverable">
            <strong>Purchases</strong>
            <div
              id="moreDropdown"
              class="navbar-dropdown"
            >
              <div class="navbar-item">
                <router-link to="/Purlist">
                  List
                </router-link>
              </div>
              <hr class="navbar-divider">
              <div class="navbar-item">
                <router-link to="/Pur/new">
                  New
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <section>
      <br>
      <br>
      <br>
      <br>
      <br>
      <div class="center">
        <h1 class="title is-3">
          Model Projects and Purchases Manager
        </h1>
      </div>
      <router-view />
    </section>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      navIsActive: false
    }
  },
  methods: {
    toggleMenu: function () {
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
