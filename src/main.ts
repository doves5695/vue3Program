import { createApp } from 'vue'
import App from './App.vue'
// 引入element-plus插件与样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// @ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'virtual:svg-icons-register'
import globalComponent from '@/components/index'
import '@/styles/index.scss'
import router from './router'
import pinia from './store'
import './permission'
// 控制暗黑模式
import 'element-plus/theme-chalk/dark/css-vars.css'
// 引入自定义指令
import {isHasButton} from '@/directive/has'
const app = createApp(App)
app.use(ElementPlus, {
  locale: zhCn,
})
app.use(globalComponent)
app.use(router)
app.use(pinia)

isHasButton(app);

app.mount('#app')
