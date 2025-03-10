import { createApp } from 'vue'
import App from './App.vue'
import {createPinia} from "pinia";
import piniaPlugPersistedState from 'pinia-plugin-persistedstate'
import nutUi from '@nutui/nutui'
import '@nutui/nutui/dist/style.css'
import router from './router'
import ArcoVue from "@arco-design/web-vue";
import '@arco-design/web-vue/dist/arco.css'
import { IconFont } from '@nutui/icons-vue'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPlugPersistedState)

app.use(pinia)
    .use(router)
    .use(nutUi)
    .use(ArcoVue)


app.mount('#app')
