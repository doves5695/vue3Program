import { defineStore } from 'pinia'

let useLayOutSettingStore = defineStore('Setting', {
  state: () => {
    return {
      fold: false,
      refsh: false // 用于控制tabbar上的刷新效果
    }
  },
})
export default useLayOutSettingStore;
