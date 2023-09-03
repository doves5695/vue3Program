import pinia from "@/store";
// 引入用户仓库
import useUserStore from "@/store/modules/user"
const userStore = useUserStore(pinia);

export const isHasButton = (app: any) => {
    //全局自定义指令:实现按钮的权限
    app.directive('has', {
    //代表使用这个全局自定义指令的DOM|组件挂载完毕的时候会执行一次
        mounted(el: any, options: any) {
            if (!userStore.buttons.includes(options.value)) {
                el.parentNode.removeChild(el);
            }
        }
    })
}
