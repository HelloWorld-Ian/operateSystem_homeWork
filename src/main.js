import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueApexCharts from "vue3-apexcharts";
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import store from './store'

const app=createApp(App)
app.use(router)
app.use(store)
app.use(VueApexCharts);
app.use(ElementPlus)
app.mount('#app')
