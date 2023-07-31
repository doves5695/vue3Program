// 商品分类全局组件的小仓库
import { defineStore } from 'pinia'
import { reqC1, reqC2, reqC3 } from '@/api/product/attr'
import type { CategoryResponseData } from '@/api/product/attr/type'
import type { CategoryState } from './types/types'
let useCategoryStore = defineStore('Category', {
  state: (): CategoryState => {
    return {
      // 一级分类数据
      c1Arr: [],
      // 一级分类id
      c1Id: '',
      // 存储一级分类下的二级分类数据
      c2Arr: [],
      // 收集二级分类id
      c2Id: '',
      // 收集二级分类下的三级分类数据
      c3Arr: [],
      // 收集三级分类id
      c3Id: '',
    }
  },
  actions: {
    async getC1() {
      // 发请求数据
      let result: CategoryResponseData = await reqC1()
      if (result.code == 200) {
        this.c1Arr = result.data
      }
    },
    async getC2() {
      let result: CategoryResponseData = await reqC2(this.c1Id)
      if (result.code == 200) {
        this.c2Arr = result.data
      }
    },
    async getC3() {
      let result: CategoryResponseData = await reqC3(this.c2Id)
      if (result.code == 200) {
        this.c3Arr = result.data
      }
    },
  },
  getters: {},
})

export default useCategoryStore
