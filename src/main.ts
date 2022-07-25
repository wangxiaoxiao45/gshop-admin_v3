import { createApp } from 'vue'
import pinia from './stores'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import './styles/index.scss'
import ElSvg from './components/SvgIcon/ElSvg'
import './permission'
import {vueEcharts} from './plugins/chart'
import './mockServer'
import CommonCard from './views/home/components/CommonCard.vue'
import has from './directives/has'

const app = createApp(App)

app.component(CommonCard.name, CommonCard)

app
  .use(router)
  .use(pinia)
  .use(ElementPlus, {
    locale: zhCn,
  })
  .use(ElSvg)
  .use(vueEcharts)
  .use(has)
  .mount('#app')
