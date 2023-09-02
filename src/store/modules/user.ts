import { defineStore } from 'pinia'
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
import type {
  loginFormData,
  loginResponseData,
  userInfoResponseData,
} from '@/api/user/type'
import type { UserState } from './types/types'
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
// 引入常量路由, 异步路由, 任意路由
import { constantRoute, asnycRoute, anyRoute } from '@/router/routes'
// 引入深拷贝方法
// @ts-ignore
import cloneDeep from 'lodash/cloneDeep'

import router from '@/router'

// 定义一个函数方法来过滤不同用户的需求展示不同的异步路由
function filterAsyncRoute (asnycRoute: any, routes: any) {
  return asnycRoute.filter((item: any) => {
    if (routes.includes(item.name)) {
      if (item.children && item.children.length> 0) {
        // 用递归再次获取一次
        item.children = filterAsyncRoute(item.children, routes)
      }
      return true
    }
  })
}

// 创建一个用户的小仓库
let useUserStore = defineStore('User', {
  state: (): UserState => {
    return {
      token: GET_TOKEN(),
      menuRoutes: constantRoute,
      username: '',
      avatar: '',
    }
  },
  actions: {
    // 用户登录的方法
    async userLogin(data: loginFormData) {
      let result: loginResponseData = await reqLogin(data)
      if (result.code == 200) {
        this.token = result.data as string
        // 本地持久化存储
        SET_TOKEN(result.data as string)
        return 'ok'
      } else {
        return Promise.reject(new Error(result.data))
      }
    },
    // 获取用户信息方法
    async userInfo() {
      let result: userInfoResponseData = await reqUserInfo()
      if (result.code === 200) {
        this.username = result.data.name
        this.avatar = result.data.avatar
        // 计算需要的异步路由
        // 注册菜单需要的路由
        this.menuRoutes = [...constantRoute, ...asnycRoute, anyRoute];
        // 追加路由
        [...asnycRoute, anyRoute].forEach((route: any) => {
          router.addRoute(route)
        })
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
    // 退出登录
    async userLogout() {
      // 退出登录请求
      let result: any = await reqLogout()
      if (result.code === 200) {
        // 如果退出成功那么清除数据
        this.token = ''
        this.username = ''
        this.avatar = ''
        REMOVE_TOKEN()
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
  },
  getters: {},
})

export default useUserStore
