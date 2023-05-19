import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import router from './router'

loadFonts()
const pinia = createPinia();

createApp(App)
  .use(router)
  .use(pinia)
  .use(vuetify)
  .mount('#app')