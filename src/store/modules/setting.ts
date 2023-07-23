import { defineStore } from "pinia";

let useLayOutSettingStore = defineStore('Setting', {
    state: () => {
        return {
            fold: false
        }
    }
})