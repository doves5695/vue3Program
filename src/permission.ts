// 路由鉴权, 某一个路由什么条件可以访问,什么条件不可以访问
import router from './router'
import setting from './setting'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
nprogress.configure({ showSpinner: false })

import pinia from './store'

import useUserStore from './store/modules/user'

let userStore = useUserStore(pinia)
// 全局前置守卫
router.beforeEach(async (to: any, from: any, next: any) => {
  document.title = `${setting.title} - ${to.meta.title}`
  nprogress.start()
  let token = userStore.token
  let username = userStore.username
  if (token) {
    if (to.path == '/login') {
      next({ path: '/' })
    } else {
      // 登录成功后如果有username才会放行
      if (username) {
        next()
      } else {
        // 如果没有那么就发请求获取到了再放行
        try {
          // 获取用户信息后再放行
          await userStore.userInfo()
          // 需要等路由加载出来再放行
          next({...to})
        } catch (error) {
          // token过期: 获取不到用户信息
          // 用户手动修改了本地信息
          // 出现问题的时候回到login页面
          await userStore.userLogout()
          next({ path: '/login', query: { redirect: to.path } })
        }
      }
    }
  } else {
    // 如果没有token代表未登录
    if (to.path == '/login') {
      next()
    } else {
      next({ path: '/login', query: { redirect: to.path } })
    }
  }
})

// 全局后置守卫
router.afterEach((to: any, from: any, next: any) => {
  nprogress.done()
})
