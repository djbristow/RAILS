<template>
  <div id="app">
    <section>
      <b-navbar>
        <template slot="brand">
          <b-navbar-item>
            <b-dropdown
              hoverable
              aria-role="list"
            >
              <button
                slot="trigger"
                class="button is-light"
              >
                <span>MRIM</span>
                <b-icon icon="menu-down" />
              </button>
              <b-dropdown-item aria-role="listitem">
                <router-link to="/">
                  Home
                </router-link>
              </b-dropdown-item>
              <b-dropdown-item aria-role="listitem">
                <router-link to="/Admix">
                  Admin
                </router-link>
              </b-dropdown-item>
              <b-dropdown-item aria-role="listitem">
                <router-link to="/Report">
                  Reports
                </router-link>
              </b-dropdown-item>
              <b-dropdown-item aria-role="listitem">
                <a
                  href="https://kjcrr.org"
                  target="_blank"
                >
                  KJ&C RR
                </a>
              </b-dropdown-item>
            </b-dropdown>
          </b-navbar-item>
        </template>
        <template slot="start">
          <b-navbar-item>
            <b-dropdown
              hoverable
              aria-role="list"
            >
              <button
                slot="trigger"
                class="button is-light"
              >
                <span>Rollingstock</span>
                <b-icon icon="menu-down" />
              </button>
              <b-dropdown-item aria-role="listitem">
                <router-link to="/Rslist">
                  List
                </router-link>
              </b-dropdown-item>
              <b-dropdown-item aria-role="listitem">
                <router-link to="/RS/new">
                  New
                </router-link>
              </b-dropdown-item>
            </b-dropdown>
          </b-navbar-item>
          <b-navbar-item>
            <b-dropdown
              hoverable
              aria-role="list"
            >
              <button
                slot="trigger"
                class="button is-light"
              >
                <span>Images</span>
                <b-icon icon="menu-down" />
              </button>
              <b-dropdown-item aria-role="listitem">
                <router-link to="/Imglist">
                  List
                </router-link>
              </b-dropdown-item>
              <b-dropdown-item aria-role="listitem">
                <router-link to="/Img/new">
                  New
                </router-link>
              </b-dropdown-item>
            </b-dropdown>
          </b-navbar-item>
          <b-navbar-item>
            <b-dropdown
              hoverable
              aria-role="list"
            >
              <button
                slot="trigger"
                class="button is-light"
              >
                <span>AAR Codes</span>
                <b-icon icon="menu-down" />
              </button>
              <b-dropdown-item aria-role="listitem">
                <router-link to="/Aarlist">
                  List
                </router-link>
              </b-dropdown-item>
              <b-dropdown-item aria-role="listitem">
                <router-link to="/Aar/new">
                  New
                </router-link>
              </b-dropdown-item>
            </b-dropdown>
          </b-navbar-item>
          <b-navbar-item>
            <b-dropdown
              hoverable
              aria-role="list"
            >
              <button
                slot="trigger"
                class="button is-light"
              >
                <span>Companies</span>
                <b-icon icon="menu-down" />
              </button>
              <b-dropdown-item aria-role="listitem">
                <router-link to="/Colist">
                  List
                </router-link>
              </b-dropdown-item>
              <b-dropdown-item aria-role="listitem">
                <router-link to="/Co/new">
                  New
                </router-link>
              </b-dropdown-item>
            </b-dropdown>
          </b-navbar-item>
        </template>
      </b-navbar>
      <div class="center">
        <h1 class="title is-3">
          Model Railroad Inventory Manager
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
